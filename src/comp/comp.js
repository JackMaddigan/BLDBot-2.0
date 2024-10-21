const { eventInfo } = require("./comp-helpers/event-info");

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
  // populate eventInfo object that is exported by reference
  // save extra event info to db
}
