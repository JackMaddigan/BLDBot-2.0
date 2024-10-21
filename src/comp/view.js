const { readData } = require("../db");
const { eventInfo } = require("./comp-helpers/event-info");
const { EmbedBuilder } = require("discord.js");

async function handleView(int) {
  const allResults = await readData(`SELECT * FROM results WHERE userId=?`, [
    int.user.id,
  ]);
  let fields = [];
  console.log(allResults);
  for (const result of allResults) {
    const resultObj = new eventInfo[result.eventId].resultObj(
      null,
      null,
      null,
      null,
      result
    );
    fields.push({
      name: eventInfo[result.eventId].eventName,
      value: resultObj.toViewString(),
      inline: true,
    });
  }

  const viewEmbed = new EmbedBuilder()
    .setColor(0x7289dd)
    .setTitle(`Results for ${int.user.username}`)
    .setTimestamp();
  if (fields.length == 0) {
    viewEmbed.setDescription("No results this week yet!");
  } else {
    viewEmbed.addFields(fields);
  }
  await int.reply({ embeds: [viewEmbed], ephemeral: true });
}

module.exports = { handleView };
