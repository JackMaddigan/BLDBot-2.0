const { saveData, readData } = require("../db");
const { eventIds } = require("../helpers/helpers");

function makeCubingChinaDataToResultObj(
  attempts,
  average,
  averageRecordTag,
  best,
  singleRecordTag,
  personName,
  wcaId,
  countryName,
  countryIso2
) {
  return {
    attempts,
    average,
    averageRecordTag:
      averageRecordTag !== "WR" &&
      averageRecordTag !== "NR" &&
      averageRecordTag !== null
        ? "CR"
        : null,
    best,
    id: null,
    person: {
      country: {
        continentName: null,
        iso2: countryIso2,
        name: countryName,
      },
      name: personName,
      wcaId: wcaId,
    },
    singleRecordTag:
      singleRecordTag !== "WR" &&
      singleRecordTag !== "NR" &&
      singleRecordTag !== null
        ? "CR"
        : null,
  };
}

function mbldScoreToInfo(score) {
  const [solved, total] = score.split("/").map((part) => Number(part));
  return {
    solved: solved,
    attempted: total,
    points: solved - (total - solved),
    unsolved: total - solved,
  };
}

async function updateResultsToBeat() {
  const types = ["single", "average"];
  for (const eventId of eventIds) {
    let average = null;
    let single = null;
    for (const type of types) {
      if (type === "average" && eventId === "333mbf") continue;
      const url = `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/rank/world/${type}/${eventId}.json`;
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }
      const data = await response.json();
      const num = eventId === "333bf" ? 99 : 24;
      if (type === "single") single = data.items[num].best;
      else average = data.items[num].best;
      console.log(data.items[num]);
    }

    await saveData(
      `INSERT INTO summary_results_to_beat (eventId, best, average) VALUES (?, ?, ?) ON CONFLICT(eventId) DO UPDATE SET best = excluded.best, average = excluded.average`,
      [eventId, single, average]
    );
  }
}

module.exports = {
  makeCubingChinaDataToResultObj,
  mbldScoreToInfo,
  updateResultsToBeat,
};
