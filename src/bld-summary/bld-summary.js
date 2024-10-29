const puppeteer = require("puppeteer");
const { readData } = require("../db");
const eventIds = new Set(["333bf", "444bf", "555bf", "333mbf"]);
const ResultObj = require("./ResultObj");
const {
  decodeMbldResult,
  fetchWCALiveQuery,
  formatDateToYYYYMMDD,
} = require("./bld-summary-helpers");
const { compIdsQuery, roundQuery } = require("./queries");

runSummary();
async function runSummary() {
  // get results to beat
  const resultsToBeat = await getResultsToBeat();

  // Create a new Date object for the current date and time
  const today = new Date();

  // Calculate the date one week ago by subtracting 7 days from the today date
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  // make collectedEventData object
  const stats = initStats();

  // Cubing China
  try {
    await processCubingChinaResults(stats, today, oneWeekAgo, resultsToBeat);
  } catch (error) {
    console.error("Error getting Cubing.com results!", error);
  }

  // WCA Live
  try {
    await processWCALiveResults(stats, today, oneWeekAgo, resultsToBeat);
  } catch (error) {
    console.error("Error getting WCA Live results!", error);
    return;
  }

  console.log(JSON.stringify(stats));
  // send stuff
}

async function processCubingChinaResults(
  stats,
  today,
  oneWeekAgo,
  resultsToBeat
) {
  const comps = await getCubingChinaComps(oneWeekAgo, today);
  const roundIds = ["f", "1", "2", "3"];
  // check every comp in the list
  const browser = await puppeteer.launch();
  for (const comp of comps) {
    const compEvents = comp.events.filter((eventId) => eventIds.has(eventId));
    const competitorList = await getCubingChinaCompetitorList(browser, comp.id);
    for (const eventId of compEvents)
      for (const roundId of roundIds) {
        const link = `https://cubing.com/live/${comp.id
          .split(/(?=[A-Z])|(?=\d{4})/)
          .join("-")}#!/event/${eventId}/${roundId}/all`;

        // scrape data
        const resultsData = await getCubingChinaTable(browser, link);

        // splice to get rid of the two header row things
        resultsData.splice(0, 2);

        // round "out of bounds" if == 0
        if (resultsData.length == 0) break;
        for (const r of resultsData) {
          // process result by making new result object
          const isMbld = eventId == "333mbf";
          const ro = new ResultObj();
          ro.createCubingChinaResult(
            r[2].text,
            competitorList[r[1]],
            eventId,
            r[3],
            isMbld ? null : r[4],
            isMbld ? r[5] : r[6],
            link
          );

          // check if record or if better than result to beat or if best result so far
          const {
            isRecordSingle,
            isRecordAverage,
            betterThanBestSoFar,
            notifySingle,
            notifyAverage,
          } = getResultStatus(ro, resultsToBeat, stats);

          // if so complete the result by adding iso2 and pr tags from WCA API
          if (
            isRecordSingle ||
            isRecordAverage ||
            betterThanBestSoFar ||
            notifyAverage ||
            notifySingle
          )
            await ro.addISO2AndTags();

          // add to statistics
          addResultObjToStatistics(
            stats,
            ro,
            betterThanBestSoFar,
            notifySingle,
            notifyAverage
          );
        }
      }
  }
  console.log("Cubing China results completed");
}

async function processWCALiveResults(stats, today, oneWeekAgo, resultsToBeat) {
  // fetch comps between the dates and filter for events
  const comps = (
    await fetchWCALiveQuery(compIdsQuery(formatDateToYYYYMMDD(oneWeekAgo)))
  ).data.competitions.filter((comp) => new Date(comp.endDate) < today);
  for (const comp of comps) {
    for (const event of comp.competitionEvents) {
      // only check bld events
      if (!eventIds.has(event.event.id)) continue;
      for (const round of event.rounds) {
        const roundData = await fetchWCALiveQuery(roundQuery(round.id));
        for (const r of roundData.data.round.results) {
          const link = `https://live.worldcubeassociation.org/competitions/${comp.id}/rounds/${round.id}`;
          const ro = new ResultObj();
          ro.createWCALiveResult(
            r.person.name,
            r.person.wcaId,
            event.event.id,
            r.best,
            r.average,
            r.attempts,
            r.singleRecordTag,
            r.averageRecordTag,
            r.person.country.iso2,
            link
          );

          // check if record or if better than result to beat or if best result so far
          const {
            isRecordSingle,
            isRecordAverage,
            betterThanBestSoFar,
            notifySingle,
            notifyAverage,
          } = getResultStatus(ro, resultsToBeat, stats);

          // add to statistics
          addResultObjToStatistics(
            stats,
            ro,
            betterThanBestSoFar,
            notifySingle,
            notifyAverage
          );
        }
      }
    }
  }
}

/**
 * Read and return benchmark times from DB which are updated the week before
 * @returns Object with eventId as the key and a sub object with the fields best and average. Best for MBLD is the WCA format number
 */
async function getResultsToBeat() {
  return (
    await readData(
      `SELECT eventId, best, average FROM summary_results_to_beat`,
      []
    )
  ).reduce((accumulator, item) => {
    accumulator[item.eventId] =
      item.eventId === "333mbf"
        ? { best: item.best, average: null }
        : { best: item.best, average: item.average };
    return accumulator;
  }, {});
}

/**
 * Make stats object to put the data into
 */
function initStats() {
  const stats = {};
  for (const eventId of eventIds) {
    stats[eventId] = {
      notify: { s: [], a: [] },
      acc: 0, // for multi this will be points, for others just cumulative of the result and used to calculate average time with num success below
      svd: { s: 0, d: 0 }, // successful or dnf attempt counter
      best: null,
    };
  }

  // add MBLD solved vs unsolved cube counter for the attempts, since the svd (solved vs dnf) will be used for the actual attempts
  stats["333mbf"].svu = {
    s: 0,
    u: 0,
  };
  return stats;
}

/**
 * Get list of comps in China between the dates
 * @param {Date()} startDate
 * @param {Date()} endDate
 * @returns list of comps from WCA API that are in China and have at least one of the events in eventIds
 * https://wca-rest-api.robiningelbrecht.be/#tag/competition_model
 */
async function getCubingChinaComps(startDate, endDate) {
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

/**
 * Get competitor list
 * @param {string} compId
 * @returns Object with key of the competitor's competition id and value of their WCA ID. The WCA ID will be null if it is a first time competitor
 */
async function getCubingChinaCompetitorList(browser, compId) {
  // get competitor list to get wca ids from
  const competitorTable = await getCubingChinaTable(
    browser,
    `https://cubing.com/competition/${compId
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
  return competitorList;
}

/**
 * Get data from a Cubing.com table
 * @param {puppeteer browser} browser
 * @param {string} link
 * @returns
 */
async function getCubingChinaTable(browser, link) {
  const page = await browser.newPage();

  await page.goto(link);

  // Wait for 3 seconds for weird loading stuff
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Now you can safely scrape the table content
  const tableData = await page.evaluate(() => {
    // Select the table within the '.table-responsive' class
    const rows = document.querySelectorAll(".table-responsive table tr");

    // Extract data from the rows
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

/**
 * Add result info to statistics
 * @param {Object} stats
 * @param {ResultObj} ro
 */
function addResultObjToStatistics(
  stats,
  ro,
  betterThanBestSoFar,
  notifySingle,
  notifyAverage
) {
  if (notifySingle) {
    const existingResult = stats[ro.eventId].notify.s.find(
      (result) => result.person.wcaId === ro.person.wcaId
    );
    if (existingResult) {
      // remove old result and add new one if this one is better
      if (existingResult.best > ro.best) {
        stats[ro.eventId].notify.s = stats[ro.eventId].notify.s.filter(
          (result) => result.person.wcaId !== ro.person.wcaId
        );
        stats[ro.eventId].notify.s.push(ro);
      }
    } else stats[ro.eventId].notify.s.push(ro);
  }
  if (notifyAverage) {
    const existingResult = stats[ro.eventId].notify.a.find(
      (result) => result.person.wcaId === ro.person.wcaId
    );
    if (existingResult) {
      // remove old result and add new one if this one is better
      if (existingResult.average > ro.average) {
        stats[ro.eventId].notify.a = stats[ro.eventId].notify.a.filter(
          (result) => result.person.wcaId !== ro.person.wcaId
        );
        stats[ro.eventId].notify.a.push(ro);
      }
    } else stats[ro.eventId].notify.a.push(ro);
  }
  if (betterThanBestSoFar) stats[ro.eventId].best = ro;
  for (const attempt of ro.attempts) {
    if (attempt > 0) {
      // increment success count
      stats[ro.eventId].svd.s++;
      if (ro.eventId == "333mbf") {
        // do mbld stuff
        // calculate points, solved and unsolved
        const attemptInfo = decodeMbldResult(attempt);
        stats[ro.eventId].acc += attemptInfo.points;
        stats[ro.eventId].svu.s += attemptInfo.solved;
        stats[ro.eventId].svu.u += attemptInfo.unsolved;
      } else {
        // non mbld stuff
        // add solve time to accumulated time
        stats[ro.eventId].acc += attempt;
      }
    } else if (attempt == -1) {
      // increment DNF solve count
      stats[ro.eventId].svd.d++;
    }
  }
}

function getResultStatus(ro, resultsToBeat, stats) {
  // check if record or if better than result to beat or if best result so far
  const recordTypes = ["NR", "CR", "WR"];
  const isRecordSingle = recordTypes.includes(ro.sRT);
  const isRecordAverage = recordTypes.includes(ro.aRT);
  const betterThanBestSoFar =
    ro.best > 0 &&
    (ro.best < stats[ro.eventId].best?.best || !stats[ro.eventId].best);
  const notifySingle =
    ro.best > 0 &&
    ((ro.best <= resultsToBeat[ro.eventId].best && ro.sRT) || isRecordSingle);
  const notifyAverage =
    ro.average > 0 &&
    ((ro.average <= resultsToBeat[ro.eventId].average && ro.aRT) ||
      isRecordAverage);
  return {
    isRecordSingle,
    isRecordAverage,
    betterThanBestSoFar,
    notifySingle,
    notifyAverage,
  };
}
