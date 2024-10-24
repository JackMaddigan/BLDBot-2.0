const { saveData, readData, deleteData } = require("../db");
const {
  eventInfo,
  eventFormatToProcessAndObj,
} = require("./comp-helpers/event-info");
const { generateRankedResults } = require("./rankings");
const cstimer = require("cstimer_module");

const fs = require("fs");

async function handleCompCommand(int, client) {
  // handle command
  const cmd = int.options.getSubcommand();
  if (cmd == "start-extra-event") await startExtraEvent(int);
  else if (cmd == "end-extra-event") await endExtraEvent(int, client);
}

async function sendPodiums(client, resultsChannel, rankedResultsData, title) {
  // make podium text
  await resultsChannel.send(title);
  const medals = [":first_place:", ":second_place:", ":third_place:"];
  for (const eventId in rankedResultsData) {
    const results = rankedResultsData[eventId];
    // no results or first one is dnf
    if (results.length == 0 || results[0]?.isDnf) continue;
    let text = `**${eventInfo[eventId].eventName}**\n`;
    for (const result of results) {
      // only include podium places
      if (result.placing > 3) break;
      text += `${medals[result.placing - 1]} ${await client.users.fetch(
        result.userId
      )} ${result.toPodiumString()}\n`;
    }
    console.log(text);
    await resultsChannel.send(text);
  }
}

async function sendResultsFile(resultsChannel, rankedResultsData) {
  // make results file
  let text = "";
  for (const eventId in rankedResultsData) {
    const results = rankedResultsData[eventId];
    if (results.length == 0) continue;
    text += `${eventInfo[eventId].eventName}\n`;
    for (const result of results) {
      text += `${result.placing} ${
        result.username
      } ${result.toTextFileString()}\n`;
    }
  }
  console.log(text);
  fs.writeFile("results.txt", text || "No Results", function (err) {
    if (err) throw err;
    console.log("results.txt" + " updated!");
  });
  await resultsChannel.send({ files: ["results.txt"] });
}

async function sendScrambles(client, week) {
  // get event ids excluding extra event
  const scramblesChannel = client.channels.cache.get(
    process.env.scramblesChannelId
  );

  await scramblesChannel.send(
    `<@&${process.env.weeklyCompRole}> Week ${week} Scrambles!`
  );

  const eventIdsArray = Object.keys(eventInfo).filter(
    (eventId) => eventId != "extra"
  );
  for (const eventId of eventIdsArray) {
    const thisEventInfo = eventInfo[eventId];
    if (!thisEventInfo.scrambleArgs) continue;
    console.log(thisEventInfo);
    if (thisEventInfo.eventId == "333mbf") {
      // mbld
      fs.writeFile("mbld.txt", cstimer.getScramble("r3ni", 75), function (err) {
        if (err) throw err;
        console.log("mbld.txt" + " updated!");
      });
      await scramblesChannel.send({
        files: ["mbld.txt"],
        content: "-\n**MBLD**",
      });
    } else {
      // 3bld 4bld 5bld
      let text = `-\n**${thisEventInfo.eventName}**`;
      for (let i = 0; i < thisEventInfo.numAttempts; i++) {
        text += `\n\n> ${i + 1}) ${cstimer.getScramble(
          thisEventInfo.scrambleArgs[0],
          thisEventInfo.scrambleArgs[1]
        )}`;
      }
      await scramblesChannel.send(text);
    }
  }
}

async function handleWeeklyComp(client) {
  let week = await getWeek();
  const resultsChannel = client.channels.cache.get(
    process.env.podiumsChannelId
  );
  // get ranked results and filter to remove extra event
  const rankedResultsData = await generateRankedResults();
  delete rankedResultsData.extra;
  // get podium text, add title and send
  const podiumsTitle = `Week ${week} results!`;
  await sendPodiums(client, resultsChannel, rankedResultsData, podiumsTitle);
  // make and send results file with title
  await sendResultsFile(resultsChannel, rankedResultsData);
  // delete results where event not extra
  await deleteData(`DELETE FROM results WHERE eventId != ?`, ["extra"]);
  // update week number
  week++;
  // send week number to submission channel
  const submitChannel = client.channels.cache.get(process.env.submitChannelId);
  await submitChannel.send(`## Week ${week}`);
  // send scrambles for the next week
  await sendScrambles(client, week);
  //   save new week number to db
  await saveData(
    `INSERT INTO key_value_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
    ["week", week]
  );
}

async function endExtraEvent(int, client) {
  if (!eventInfo.extra.eventName) {
    await int.reply({
      ephemeral: true,
      content: "There is currently no extra event!",
    });
    return;
  }

  const resultsChannel = client.channels.cache.get(
    process.env.resultsChannelId
  );
  await int.deferReply({ ephemeral: true });
  // get ranked results and filter to only include extra event
  const rankedResultsData = await generateRankedResults();
  Object.keys(rankedResultsData).forEach((key) => {
    if (key !== "extra") {
      delete rankedResultsData[key];
    }
  });
  if (rankedResultsData.extra.length == 0) {
    await int.editReply("Ended with no results");
  } else {
    const podiumsTitle = `Extra event results`;
    await sendPodiums(client, resultsChannel, rankedResultsData, podiumsTitle);
    await sendResultsFile(resultsChannel, rankedResultsData);
  }

  await deleteData(`DELETE FROM results WHERE eventId = ?`, ["extra"]);
  await deleteData(`DELETE FROM key_value_store WHERE key = ?`, [
    "extraEventInfo",
  ]);
  eventInfo.extra = {
    eventName: null,
    eventId: "extra",
    eventShortName: "extra",
    format: null,
    numAttempts: null,
    process: null,
    resultObj: null,
  };
}

/**
 * Handle the comp start-extra-event command and save the info to eventInfo and db
 */
async function startExtraEvent(int) {
  // populate eventInfo object that is exported by reference
  if (eventInfo.extra.eventName) {
    await int.reply({
      ephemeral: true,
      content:
        "There is already an ongoing extra event!\nEnd the current extra event to start a new one.",
    });
    return;
  }

  eventInfo.extra.eventName = int.options.getString("name");
  eventInfo.extra.format = int.options.getString("format");
  console.log(eventInfo.extra.format);
  eventInfo.extra.numAttempts = int.options.getInteger("attempts");
  eventInfo.extra.process =
    eventFormatToProcessAndObj[eventInfo.extra.format].process;
  eventInfo.extra.resultObj =
    eventFormatToProcessAndObj[eventInfo.extra.format].resultObj;

  // save extra event info to db (the functions get removed when stringifying)
  await saveData(
    `INSERT INTO key_value_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ["extraEventInfo", JSON.stringify(eventInfo.extra)]
  );

  await int.reply(`${eventInfo.extra.eventName} is set up!`);
}

async function getWeek() {
  const weekData = await readData(
    `SELECT value FROM key_value_store WHERE key=?`,
    ["week"]
  );
  let week = 1; // set as default week
  if (weekData) week = weekData[0].value;
  console.log(week);
  return week;
}

module.exports = { handleCompCommand, handleWeeklyComp };
