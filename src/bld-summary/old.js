const puppeteer = require("puppeteer");

const { readData } = require("../db");
const {
  formatDateToYYYYMMDD,
  fetchWCALiveQuery,
  isDateBeforeOrEqual,
  decodeMbldResult,
  rankMbldResults,
  makeCubingChinaDataToResultObj,
  mbldScoreToInfo,
} = require("./bld-summary-helpers");
const { compIdsQuery, roundQuery } = require("./queries");
const { toCenti } = require("../helpers/converters");

const eventIds = new Set(["333bf", "444bf", "555bf", "333mbf"]);
const recordTags = new Set(["NR", "CR", "WR"]);

runBLDSummary();
async function runBLDSummary() {
  // get results to beat
  const resultsToBeat = await getResultsToBeat();
  // Create a new Date object for the current date and time
  const today = new Date();
  // Calculate the date one week ago
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  // make collectedEventData object
  const collectedEventData = initCollectedEventDataObject();

  // temporary
  const cubingChinaCompsLastWeek = await getCubingChinaComps(oneWeekAgo, today);
  await processCubingChinaComps(
    cubingChinaCompsLastWeek,
    collectedEventData,
    resultsToBeat
  );

  return;
  // get array of all comps in the last week from wca live, containing the events and round ids for each event
  const wcaLiveCompsLastWeek = (
    await fetchWCALiveQuery(compIdsQuery(formatDateToYYYYMMDD(oneWeekAgo)))
  ).data.competitions.filter((comp) =>
    isDateBeforeOrEqual(comp.endDate, formatDateToYYYYMMDD(today))
  );

  // loop through all comps on wca live
  for (const comp of wcaLiveCompsLastWeek) {
    for (const event of comp.competitionEvents) {
      // only check bld events
      if (!eventIds.has(event.event.id)) continue;
      for (const roundId of event.rounds) {
        const roundData = await fetchWCALiveQuery(roundQuery(roundId.id));
        for (const result of roundData.data.round.results) {
          const link = `https://live.worldcubeassociation.org/competitions/${comp.id}/rounds/${roundId.id}`;
          addResultInfoWCALive(
            collectedEventData,
            result,
            event.event.id,
            resultsToBeat,
            link
          );
        }
      }
    }
  }

  // collectedEventData now contains all data from WCA Live, now need to do Cubing.com...
  console.log(JSON.stringify(collectedEventData));
}

function addResultInfoWCALive(
  collectedEventData,
  result,
  eventId,
  resultsToBeat,
  link
) {
  if (eventId == "333mbf") {
    // add individial attempt data to statistics fields
    for (const attempt of result.attempts) {
      if (attempt.result > 0) {
        collectedEventData[eventId].successVsDnfAttemptCount.success++;
        const decoded = decodeMbldResult(attempt.result);
        collectedEventData[eventId].cumulativeSuccessResult += decoded.points;
        collectedEventData[eventId].successVsDnfSolveCount.success +=
          decoded.solved;
        collectedEventData[eventId].successVsDnfSolveCount.dnf +=
          decoded.unsolved;
      } else if (attempt.result == -1) {
        collectedEventData[eventId].successVsDnfAttemptCount.dnf++;
      }
    }
    // decide whether to add as top result or not for best attempt
    // skip if dnf or dns, as we already added the statistics info so it isn't needed anymore
    if (result.best <= 0) return;
    const decodedBest = decodeMbldResult(result.best);
    if (
      (rankMbldResults(decodedBest, resultsToBeat[eventId].best) === 1 &&
        result.singleRecordTag !== null) ||
      recordTags.has(result.singleRecordTag)
    ) {
      // add to list
      let obj = {
        type: "single",
        recordTag: result.singleRecordTag,
        link: link,
        result: decodedBest,
        person: { ...result.person },
      };
      collectedEventData[eventId].resultsForSummary.push(obj);
    }

    // check if it is better than the best result for the weekend
    if (
      collectedEventData[eventId].bestResult == null ||
      rankMbldResults(
        decodedBest,
        collectedEventData[eventId].bestResult?.bestAttemptDecoded
      ) == 1
    ) {
      collectedEventData[eventId].bestResult = {
        result: result,
        bestAttemptDecoded: decodedBest,
      };
    }
  } else {
    // add individial attempt data to statistics fields
    for (const attempt of result.attempts) {
      if (attempt.result > 0) {
        collectedEventData[eventId].cumulativeSuccessResult += attempt.result;
        collectedEventData[eventId].successVsDnfSolveCount.success++;
      } else if (attempt.result == -1) {
        collectedEventData[eventId].successVsDnfSolveCount.dnf++;
      }
    }

    // compare to best result of the weekend
    if (
      collectedEventData[eventId].bestResult == null ||
      (result.best > 0 &&
        result.best < collectedEventData[eventId].bestResult?.best)
    ) {
      collectedEventData[eventId].bestResult = result;
    }

    // decide whether to add as top result or not for single and or average
    // compare the best and average to the results to beat, add if less or equal
    if (
      result.best > 0 &&
      ((result.best < resultsToBeat[eventId].best &&
        result.singleRecordTag !== null) ||
        recordTags.has(result.singleRecordTag))
    ) {
      let obj = {
        type: "single",
        recordTag: result.singleRecordTag,
        link: link,
        result: result.best,
        person: { ...result.person },
      };
      collectedEventData[eventId].resultsForSummary.push(obj);
    }
    if (
      result.average > 0 &&
      ((result.average < resultsToBeat[eventId].average &&
        result.averageRecordTag !== null) ||
        recordTags.has(result.averageRecordTag))
    ) {
      let obj = {
        type: "average",
        recordTag: result.averageRecordTag,
        link: link,
        result: result.average,
        person: { ...result.person },
      };
      collectedEventData[eventId].resultsForSummary.push(obj);
    }
  }
}

async function getResultsToBeat() {
  return (
    await readData(
      `SELECT eventId, best, average FROM summary_results_to_beat`,
      []
    )
  ).reduce((accumulator, item) => {
    accumulator[item.eventId] =
      item.eventId === "333mbf"
        ? { best: decodeMbldResult(item.best), average: null }
        : { best: item.best, average: item.average };
    return accumulator;
  }, {});
}

function initCollectedEventDataObject() {
  const collectedEventData = {};
  for (const eventId of eventIds) {
    collectedEventData[eventId] = {
      resultsForSummary: [],
      cumulativeSuccessResult: 0, // for multi this will be points, for others just cumulative of the result and used to calculate average time with num success below
      successVsDnfSolveCount: { success: 0, dnf: 0 }, // for multi this will be solved and unsolved cubes in the attempt (only for successful attempts)
      bestResult: null,
    };
    // for multi add an extra field to count the number of successful or dnf attempts, to calculate avg number of points per attempt. Can also calculate chance of dnfing an attempt
    if (eventId == "333mbf") {
      collectedEventData["333mbf"].successVsDnfAttemptCount = {
        success: 0,
        dnf: 0,
      };
    }
  }
  return collectedEventData;
}

/**
 *
 * @param {Date()} startDate
 * @param {Date()} endDate
 * @returns
 */
async function getCubingChinaComps(startDate, endDate) {
  // temporary setting date back for testing so there is data
  startDate = new Date("2024-05-29"); //startDate.setDate(endDate.getDate() - 50);
  endDate = new Date("2024-06-03");
  console.info(startDate, endDate);
  const url = `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/CN.json`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
    return;
  }
  const compsArray = (await response.json())?.items.filter(
    (comp) =>
      new Date(comp.date.from) >= startDate &&
      new Date(comp.date.till) <= endDate &&
      comp.events.some((compEventId) => eventIds.has(compEventId))
  );
  // compsArray only contains comps in the date range and that have at least one event from eventIds
  return compsArray;
}

async function processCubingChinaComps(
  cubingChinaCompsLastWeek,
  collectedEventData,
  resultsToBeat
) {
  const roundIds = ["f", "1", "2", "3"];
  // check every comp in the list
  const browser = await puppeteer.launch();
  for (const comp of cubingChinaCompsLastWeek) {
    // get list of eventIds to check
    const eventsAtThisComp = comp.events.filter((eventId) =>
      eventIds.has(eventId)
    );

    // get competitor list to get wca ids from
    const competitorTable = await getCubingChinaTable(
      browser,
      `https://cubing.com/competition/${comp.id
        .split(/(?=[A-Z])|(?=\d{4})/)
        .join("-")}/competitors`
    );
    competitorTable.splice(0, 3);

    // get competitor list object that has key of competitor id and value of wca id so can check wca api for PRs
    const competitorList = competitorTable.reduce((accumulator, item) => {
      accumulator[item[0]] = item[1].hasOwnProperty("link")
        ? item[1].link.split("/").pop()
        : null;
      return accumulator;
    }, {});
    for (const eventId of eventsAtThisComp) {
      for (const round of roundIds) {
        // for every round of every BLD event
        const link = `https://cubing.com/live/${comp.id
          .split(/(?=[A-Z])|(?=\d{4})/)
          .join("-")}#!/event/${eventId}/${round}/all`;

        // scrape data
        const resultsData = await getCubingChinaTable(browser, link);

        // splice to get rid of the two header row things
        resultsData.splice(0, 2);

        // round out of bounds ig if == 0
        if (resultsData.length == 0) break;
        // Do stuff with the array of arrays of results
        for (const result of resultsData) {
          if (eventId === "333mbf") {
            // MBLD results
            const [bestResultTime, bestResultScore, recordTag] = result[3]
              .split(" ")
              .reverse();
            // if(["dnf", "dns"].includes(bestResultTime.toLowerCase())){
            //   // dnf
            // }

            // loop through solves and add to statistics
            const attempts = result[5];
            const attemptParts = attempts
              .split(/\s+/)
              .filter((text) => /\S/.test(text));

            for (let i = 0; i < attemptParts.length; i++) {
              const part = attemptParts[i].toLowerCase();
              if (part == "dnf") {
                // add dnf stat
                collectedEventData[eventId].successVsDnfAttemptCount.dnf++;
              } else if (part != "dns") {
                collectedEventData[eventId].successVsDnfAttemptCount.success++;
                const decoded = mbldScoreToInfo(attemptParts[i]);
                collectedEventData[eventId].cumulativeSuccessResult +=
                  decoded.points;
                collectedEventData[eventId].successVsDnfSolveCount.success +=
                  decoded.solved;
                collectedEventData[eventId].successVsDnfSolveCount.dnf +=
                  decoded.unsolved;
                i++; // success has a time so need to skip past the time which is i+1
              }
            }

            if (["dnf", "dns"].includes(bestResultScore.toLowerCase())) break;
            let bestAttempt = mbldScoreToInfo(bestResultScore);
            bestAttempt.seconds = toCenti(bestResultTime) / 100;
            const betterThanResultToBeat =
              rankMbldResults(resultsToBeat[eventId].best, bestAttempt) == 1
                ? true
                : false;
            // check if best is better than the result to beat, if so then get the data from wca api on the person and see if it beats PR. If so, make the result object and add to resultsForSummary
            // check if best is better than best result so far, if so then also get the data from wca api on the person and make the result and save to best result so far
            // if it is a record then also get the data and add to resultsForSummary
          } else {
            // 3BLD 4BLD 5BLD results
            const [best, singleRecordTag] = result[3].split(" ").reverse();
            const bestCenti = toCenti(best);
            const [average, averageRecordTag] = result[4].split(" ").reverse();
            const averageCenti = average.length > 0 ? toCenti(average) : -1;
            const averageLessThanAverageToBeat =
              averageCenti > 0 && averageCenti < resultsToBeat[eventId].average;
            const singleLessThanSingleToBeat =
              bestCenti > 0 && bestCenti < resultsToBeat[eventId].best;
            const isBestResultSoFar =
              collectedEventData[eventId].bestResult == null ||
              (result.best > 0 &&
                result.best < collectedEventData[eventId].bestResult?.best);
            const isRecord = singleRecordTag || averageRecordTag;
            const solvesInCenti = result[6]
              .split(/\s+/)
              .map((solve) => toCenti(solve))
              .filter((solve) => solve !== 0);

            // only check further if it meets the criteria of one possibly being less than the result to beat
            // need to check for records too...
            if (
              singleLessThanSingleToBeat ||
              averageLessThanAverageToBeat ||
              isBestResultSoFar ||
              isRecord
            ) {
              // check wca api to get PRs and data to fill out object
              let iso2 = null;
              let personData = null;
              const personUrl = `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${
                competitorList[result[1]]
              }.json`;
              if (competitorList[result[1]]) {
                const personResponse = await fetch(personUrl);
                if (!personResponse.ok) {
                  console.error(
                    "Error fetching person from WCA API",
                    personResponse.status
                  );
                  break;
                }
                personData = await personResponse.json();
                iso2 = personData.country;
              }

              // add the data from the api to the object
              // the null stuff is temporary
              const dataObj = makeCubingChinaDataToResultObj(
                solvesInCenti,
                averageCenti,
                averageRecordTag || null,
                bestCenti,
                singleRecordTag || null,
                result[2].text,
                competitorList[result[1]],
                result[5],
                iso2
              );
              if (singleLessThanSingleToBeat) {
                // check single against personal data to see if PR
                const currentPRSingle =
                  personData?.rank?.singles
                    ?.filter((item) => item?.eventId === eventId)
                    .pop()?.best || -1;
                if (
                  currentPRSingle <= 0 ||
                  bestCenti <= currentPRSingle ||
                  singleRecordTag
                ) {
                  // add to list
                  let obj = {
                    type: "single",
                    recordTag: dataObj.singleRecordTag,
                    link: link,
                    result: dataObj.best,
                    person: { ...dataObj.person },
                  };
                  collectedEventData[eventId].resultsForSummary.push(obj);
                }
              }
              if (averageLessThanAverageToBeat) {
                // check average against personal data to see if PR
                const currentPRAverage =
                  personData?.rank?.averages
                    ?.filter((item) => item?.eventId === eventId)
                    .pop()?.best || -1;
                if (
                  currentPRAverage <= 0 ||
                  averageCenti <= currentPRAverage ||
                  averageRecordTag
                ) {
                  // add to list
                  let obj = {
                    type: "average",
                    recordTag: dataObj.averageRecordTag,
                    link: link,
                    result: dataObj.average,
                    person: { ...dataObj.person },
                  };
                  collectedEventData[eventId].resultsForSummary.push(obj);
                }
              }
              if (isBestResultSoFar) {
                // update collectedEventData[evenId].bestResult
                collectedEventData[eventId].bestResult = dataObj;
              }
            }
            // add to statistics

            for (const solve of solvesInCenti) {
              if (solve > 0) {
                collectedEventData[eventId].cumulativeSuccessResult += solve;
                collectedEventData[eventId].successVsDnfSolveCount.success++;
              } else if (solve == -1) {
                collectedEventData[eventId].successVsDnfSolveCount.dnf++;
              }
            }
          }
        }
      }
    }
  }
  await browser.close();
  console.log(JSON.stringify(collectedEventData, null, 2));
}

async function getCubingChinaTable(browser, link) {
  const page = await browser.newPage();

  await page.goto(link);

  await page.waitForFunction(
    () => {
      const loadingElement = document.querySelector(".loading"); // Adjust the selector as necessary
      return !loadingElement; // || loadingElement.style.display === "none";
    },
    { timeout: 10000 }
  );

  // Wait for 3 seconds for weird loading stuff
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Now you can safely scrape the table content
  const tableData = await page.evaluate(() => {
    // Select the table within the '.table-responsive' class
    const rows = document.querySelectorAll(".table-responsive table tr");

    // Extract data from the rows (for simplicity, just getting the text content here)
    return Array.from(rows, (row) =>
      Array.from(row.cells, (cell) => {
        const anchor = cell.querySelector("a"); // Find <a> elements in the cell
        return anchor
          ? { text: anchor.innerText, link: anchor.href }
          : cell.innerText; // Return link and text or cell text
      })
    );
  });

  await page.close(); // Close the page
  return tableData;
}
