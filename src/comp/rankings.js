const { readData } = require("../db");
const { eventInfo } = require("./comp-helpers/event-info");
const { EmbedBuilder } = require("discord.js");

async function generateRankedResults() {
  const allResults = await readData(`SELECT * FROM results`);

  // make key value object with all event ids from the event-info file
  const eventResults = {};
  Object.keys(eventInfo).forEach((key) => (eventResults[key] = []));

  // add all the results as new result objects to their corresponding arrays
  for (const result of allResults) {
    console.log(result.eventId);
    const resultConstructor = eventInfo[result.eventId].resultObj;
    // skip if it is an extra event result when there is no valid extra event, although this shouldn't happen
    if (resultConstructor == null) continue;
    eventResults[result.eventId].push(
      new resultConstructor(null, null, null, null, result)
    );
  }

  // sort and give places
  for (const eventId in eventResults) {
    eventResults[eventId].sort((a, b) => a.compareTo(b));
    for (let i = 0; i < eventResults[eventId].length; i++) {
      if (i == 0) {
        eventResults[eventId][i].placing = 1;
        continue;
      }
      eventResults[eventId][i].givePlacing(eventResults[eventId][i - 1], i);
    }
  }

  // eventResults are all ranked
  console.log(eventResults);
  return eventResults;
}

async function currentRankings(int) {
  const eventResults = await generateRankedResults();
  let text = "";
  for (const [eventId, results] of Object.entries(eventResults)) {
    // only add if there is results for the event, dnfs are fine to display for current rankings
    if (results.length > 0) text += `**${eventInfo[eventId].eventName}**\n`;
    for (const result of results) {
      text += `#${result.placing} ${
        result.username
      } ${result.toCurrentRankingsString()}\n`;
    }
  }

  if (text.length == 0) {
    text += "No results yet!";
  }
  const currentRankingsEmbed = new EmbedBuilder()
    .setColor(0x7289dd)
    .setTitle("Current Competition Rankings")
    .setDescription(text)
    .setTimestamp();

  await int.reply({ embeds: [currentRankingsEmbed], ephemeral: true });
}

module.exports = {
  currentRankings,
};
