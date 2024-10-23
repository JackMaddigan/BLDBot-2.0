const { saveData } = require("../db");
const {
  eventInfo,
  eventFormatToProcessAndObj,
} = require("./comp-helpers/event-info");

async function handleCompCommand(int) {
  // handle command
  const cmd = int.options.getSubcommand();
  if (cmd == "start-extra-event") await startExtraEvent(int);
}

async function makePodiumText(rankedResultsData) {
  // make podium text
}

async function makeResultsFile(rankedResultsData) {
  // make results file
}

async function sendScrambles() {
  // send scrambles
}

async function handleWeeklyComp(client) {
  // get ranked results and filter to remove extra event
  // get podium text, add title and send
  // make and send results file with title
  // delete results where event not extra
  // update week number in db
  // send week number to submission channel
}

async function handleEndExtraEvent(int, client) {
  // get ranked results and filter to only include extra event
  // get podium text, add title and send
  // make and send results file with title
  // delete results where event extra
}

async function startExtraEvent(int) {
  // get user input
  const eventName = int.options.getString("name");
  const format = int.options.getString("format");
  const numAttempts = int.options.getInteger("attempts");

  // populate eventInfo object that is exported by reference
  eventInfo.extra.eventName = eventName;
  eventInfo.extra.format = format;
  eventInfo.extra.numAttempts = numAttempts;
  eventInfo.extra.process = eventFormatToProcessAndObj[format].process;
  eventInfo.extra.resultObj = eventFormatToProcessAndObj[format].resultObj;

  // save extra event info to db
  await saveData(
    `INSERT INTO key_value_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ["extraEventInfo", eventInfo.extra]
  );

  await int.reply(`${eventName} is set up!`);
}

module.exports = { handleCompCommand };
