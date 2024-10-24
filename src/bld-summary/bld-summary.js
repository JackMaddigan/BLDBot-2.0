// fetch comps in the timeframe from unnoficial wca api that are in china
// fetch comps in the timeframe from wca live
// fetch china comps, if error continue
// add all results to list

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

// async function fetchAllCompIdsInTimeframe(startDate, endDate) {
//   const url = `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/rank/world/${filePath}.json`;
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   const responseJson = await response.json();
//   const itemAtRankLimit = responseJson.items[ranksLimit];
// }

runBLDSummary();
async function runBLDSummary() {
  // get results to beat
  const resultsToBeat = (
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
  // Create a new Date object for the current date and time
  const today = new Date();
  // Calculate the date one week ago
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  // make collectedEventData object
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

  // get array of all comps in the last week from wca live, containing the events and round ids for each event
  const competitionsLastWeek = (
    await fetchWCALiveQuery(compIdsQuery(formatDateToYYYYMMDD(oneWeekAgo)))
  ).data.competitions.filter((comp) =>
    isDateBeforeOrEqual(comp.endDate, formatDateToYYYYMMDD(today))
  );

  // loop through all comps on wca live
  for (const comp of competitionsLastWeek) {
    for (const event of comp.competitionEvents) {
      if (!eventIds.has(event.event.id)) continue;
      for (const roundId of event.rounds) {
        const roundData = await fetchWCALiveQuery(roundQuery(roundId.id));
        for (const result of roundData.data.round.results) {
          const link = `https://live.worldcubeassociation.org/competitions/${comp.id}/rounds/${roundId.id}`;
          addAttemptInfo(
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
  console.log(JSON.stringify(collectedEventData));
}

function addAttemptInfo(
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
