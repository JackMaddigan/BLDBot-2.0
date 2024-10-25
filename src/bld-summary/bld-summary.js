// fetch comps in the timeframe from unnoficial wca api that are in china
// fetch comps in the timeframe from wca live
// fetch china comps, if error continue
// add all results to list
const fs = require("fs");

const { readData } = require("../db");
const {
  formatDateToYYYYMMDD,
  fetchWCALiveQuery,
  isDateBeforeOrEqual,
  decodeMbldResult,
  rankMbldResults,
} = require("./bld-summary-helpers");
const { compIdsQuery, roundQuery } = require("./queries");

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
  await processCubingChinaComps(cubingChinaCompsLastWeek, collectedEventData);

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
      let success = attempt.result > 0;
      if (success) {
        collectedEventData[eventId].successVsDnfAttemptCount.success++;
        const decoded = decodeMbldResult(attempt.result);
        collectedEventData[eventId].cumulativeSuccessResult += decoded.points;
        collectedEventData[eventId].successVsDnfSolveCount.success +=
          decoded.solved;
        collectedEventData[eventId].successVsDnfSolveCount.dnf +=
          decoded.unsolved;
      } else {
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
      let success = attempt.result > 0;
      if (success) {
        collectedEventData[eventId].cumulativeSuccessResult += attempt.result;
        collectedEventData[eventId].successVsDnfSolveCount.success++;
      } else {
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
  startDate.setDate(endDate.getDate() - 50);
  console.log(startDate, endDate);
  const url = `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/CN.json`;
  const response = await fetch(url);
  if (!response.ok) {
    console.log(`HTTP error! status: ${response.status}`);
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
  collectedEventData
) {
  const roundIds = ["f", "1", "2", "3"];
  // check every comp in the list
  for (const comp of cubingChinaCompsLastWeek) {
    // get list of eventIds to check
    const eventsAtThisComp = comp.events.filter((eventId) =>
      eventIds.has(eventId)
    );

    for (const eventId of eventsAtThisComp) {
      for (const round of roundIds) {
        // for every round of every BLD event
        // const link = `https://cubing.com/live/${comp.name.replaceAll(
        //   " ",
        //   "-"
        // )}#!/event/${eventId}/${round}/all`;
        // const response = await fetch(link);
        // if (!response.ok) {
        //   break;
        // }
        // const html = await response.text();
        // console.log(html);
        // return;
      }
    }
  }
}
