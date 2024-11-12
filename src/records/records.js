const { EmbedBuilder } = require("discord.js");
const { readData, saveData, deleteData } = require("../db");
const {
  decodeMbldResult,
  centiToDisplay,
  eventIdToName,
} = require("../helpers/converters");
const { eventIds } = require("../helpers/helpers");
const { fetchWCALiveQuery } = require("../helpers/helpers");
const { recentRecordsQuery } = require("../queries");

async function fetchRecords(client) {
  const thisMinute = new Date(Math.floor(Date.now() / 60000) * 60000);
  let records = (await fetchWCALiveQuery(recentRecordsQuery))?.data
    .recentRecords;
  records = records.filter((record) =>
    eventIds.has(
      record.result.round.competitionEvent.event.id &&
        thisMinute - new Date(record.result.enteredAt) < 3.6e6
    )
  );

  const missingAvatar =
    "https://assets.worldcubeassociation.org/assets/762e5e6/assets/missing_avatar_thumb-d77f478a307a91a9d4a083ad197012a391d5410f6dd26cb0b0e3118a5de71438.png";

  const getCol = {
    WR: 0xf44336,
    CR: 0xffeb3b,
    NR: 0x00e676,
  };

  const getPicPath = {
    WR: "https://raw.githubusercontent.com/JackMaddigan/images/main/wr.png",
    CR: "https://raw.githubusercontent.com/JackMaddigan/images/main/cr.png",
    NR: "https://raw.githubusercontent.com/JackMaddigan/images/main/nr.png",
  };

  const adminChannel = client.channels.cache.get(process.env.adminChannelId);
  for (const record of records) {
    const recordId = record.id + record.attemptResult;
    const existing =
      (
        await readData(`SELECT recordId FROM records WHERE recordId=?`, [
          recordId,
        ])
      ).length > 0;
    // await deleteData(`DELETE FROM records`);

    if (existing) continue;
    await saveData(`INSERT INTO records (recordId, enteredAt) VALUES (?, ?)`, [
      recordId,
      thisMinute,
    ]);
    // new record
    const eventId = record.result.round.competitionEvent.event.id;
    const link = `https://live.worldcubeassociation.org/competitions/${record.result.person.competition.id}/rounds/${record.result.round.id}`;
    let title = "";
    let text = `${
      record.result.person.country.name
    } :flag_${record.result.person.country.iso2.toLowerCase()}:`;
    if (eventId === "333mbf") {
      const ai = decodeMbldResult(record.attemptResult);
      title = `MBLD result of ${ai.solved}/${ai.attempted} in ${centiToDisplay(
        ai.seconds * 100,
        true
      )}`;
    } else {
      title = `${
        eventIdToName[record.result.round.competitionEvent.event.id]
      } ${record.type} of ${centiToDisplay(record.attemptResult)}`;
      if (record.type === "average")
        text += `\n(${record.result.attempts
          .map((attempt) => centiToDisplay(attempt.result))
          .join(", ")})`;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: record.result.person.name,
        iconURL: record.result.person.avatar?.thumbUrl || missingAvatar,
        url: `https://www.worldcubeassociation.org/persons/${record.result.person.wcaId}`,
      })
      .setTitle(title)
      .setURL(link)
      .setDescription(text)
      .setTimestamp()
      .setThumbnail(getPicPath[record.tag])
      .setColor(getCol[record.tag]);

    await adminChannel.send({ embeds: [embed] });
  }
  await deleteOldRecords();
}

async function deleteOldRecords() {
  const now = Date.now();
  const twoHrs = 7.2e6;
  const cutoff = now - twoHrs;
  deleteData(`DELETE FROM records WHERE enteredAt < ?`, [cutoff]);
}

module.exports = fetchRecords;
