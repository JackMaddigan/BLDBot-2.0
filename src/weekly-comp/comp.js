
const { saveData, readData, deleteData } = require("../db");
const { events, eventFormatToProcessAndObj } = require("./events");
const { generateRankedResults } = require("./results");
const cstimer = require("cstimer_module");
const fs = require("fs");

async function handleCompCommand(int, client) {
  // handle command
  const cmd = int.options.getSubcommand();
  if (cmd == "start-extra-event") { await startExtraEvent(int); }
  else if (cmd == "end-extra-event") { await endExtraEvent(int, client); }
  else if(cmd === "clear-results") { 
    await int.deferReply();
    await deleteData(`DELETE FROM results`, []);
    await int.editReply("Done");
  } 
  else if(cmd === "post-results") { 
    await int.deferReply();
    await postResults(client); 
    await int.editReply("Done");
  }
  else if(cmd === "send-scrambles") { 
    await int.deferReply();
    await postNewWeek(client);
    await int.editReply("Done");
  }
}

// Post scrambles and update the week
async function postNewWeek(client){
  // get current week and increment before sending
  let week = await getWeek();
  week++;
  await sendScrambles(client, week);
  // send week to submission channel
  const submitChannel = client.channels.cache.get(process.env.submitChannelId);
  await submitChannel.send(`## Week ${week}`);
  // save the new week
  await saveData(
    `INSERT INTO key_value_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
    ["week", week]
  );
}

// Post results
async function postResults(client){
  const rankedResultsData = await generateRankedResults();
  let week = await getWeek();
  delete rankedResultsData.extra;
  const podiumsTitle = `Week ${week} results!`;
  const resultsChannel = client.channels.cache.get(
    process.env.podiumsChannelId
  );
  await sendPodiums(resultsChannel, rankedResultsData, podiumsTitle);
  await sendResultsFile(resultsChannel, rankedResultsData);
}

// Send podiums as called by postResults
async function sendPodiums(resultsChannel, rankedResultsData, title) {
  // make podium text
  await resultsChannel.send(title);
  for (const eventId in rankedResultsData) {
    const results = rankedResultsData[eventId];
    // no results or first one is dnf
    if (results.length == 0 || results[0]?.isDnf) continue;
    let text = `**${events[eventId].name}**`;
    for (const result of results) {
      // only include podium places
      if (result.placing > 3 || result.isDnf) break;
      text += result.toPodiumString();
    }
    await resultsChannel.send(text);
  }
}

// Send results file as called by postResults
async function sendResultsFile(resultsChannel, rankedResultsData) {
  // make results file
  let text = "";
  for (const eventId in rankedResultsData) {
    const results = rankedResultsData[eventId];
    if (results.length == 0) continue;
    text += `${events[eventId].name}\n`;
    for (const result of results) {
      text += result.toTxtFileString();
    }
    text += "\n\n";
  }
  text = text.trim();
  fs.writeFileSync("results.txt", text || "No Results", function (err) {
    if (err) throw err;
  });
  await resultsChannel.send({ files: ["results.txt"] });
}

// Send scrambles as called by postNewWeek
async function sendScrambles(client, week) {
  // get event ids excluding extra event
  const scramblesChannel = client.channels.cache.get(
    process.env.scramblesChannelId
  );

  await scramblesChannel.send(
    `<@&${process.env.weeklyCompRole}> Week ${week} Scrambles!`
  );

  const eventIdsArray = Object.keys(events).filter(
    (eventId) => eventId != "extra"
  );
  for (const eventId of eventIdsArray) {
    const event = events[eventId];
    if (!event.scr) continue;
    if (eventId == "333mbf") {
      // mbld
      fs.writeFileSync(
        "mbld.txt",
        cstimer.getScramble(event.scr[0], event.scr[1]),
        function (err) {
          if (err) throw err;
        }
      );
      await scramblesChannel.send({
        files: ["mbld.txt"],
        content: "-\n**MBLD**",
      });
    } else {
      // 3bld 4bld 5bld
      let text = `-\n**${event.name}**`;
      for (let i = 0; i < event.attempts; i++) {
        text += `\n\n> ${i + 1}) ${cstimer.getScramble(
          event.scr[0],
          event.scr[1]
        )}`;
      }
      await scramblesChannel.send(text);
    }
  }
}

// Parent function to handle the comp
async function handleWeeklyComp(client) {
  await postResults(client);
  await postNewWeek(client);
  await deleteData(`DELETE FROM results WHERE eventId != ?`, ["extra"]);
}

async function endExtraEvent(int, client) {
  if (!events.extra.process) {
    await int.reply({
      flags: 64,
      content: "There is currently no extra event!",
    });
    return;
  }

  const resultsChannel = client.channels.cache.get(
    process.env.resultsChannelId
  );
  await int.deferReply({ flags: 64 });
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
    await sendPodiums(resultsChannel, rankedResultsData, podiumsTitle);
    await sendResultsFile(resultsChannel, rankedResultsData);
    await int.editReply("Ended");
  }

  await deleteData(`DELETE FROM results WHERE eventId = ?`, ["extra"]);
  await deleteData(`DELETE FROM key_value_store WHERE key = ?`, [
    "extraEventInfo",
  ]);
  events.extra = {
    name: null,
    process: null,
    scr: null,
    attempts: null,
    obj: null,
  };
}

/**
 * Handle the comp start-extra-event command and save the info to eventInfo and db
 */
async function startExtraEvent(int) {
  if (events.extra.process) {
    await int.reply({
      flags: 64,
      content:
        "There is already an ongoing extra event!\nEnd the current extra event to start a new one.",
    });
    return;
  }

  events.extra.name = int.options.getString("name");
  events.extra.format = int.options.getString("format");
  events.extra.attempts = int.options.getInteger("attempts");
  events.extra.process =
    eventFormatToProcessAndObj[events.extra.format].process;
  events.extra.obj = eventFormatToProcessAndObj[events.extra.format].obj;

  // save extra event info to db (the functions get removed when stringifying)
  await saveData(
    `INSERT INTO key_value_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ["extraEventInfo", JSON.stringify(events.extra)]
  );

  await int.reply(`${events.extra.name} is set up!`);
}

async function getWeek() {
  const weekData = await readData(
    `SELECT value FROM key_value_store WHERE key=?`,
    ["week"]
  );
  const week = weekData.length ? weekData[0].value : 95;
  return week;
}

module.exports = { handleCompCommand, handleWeeklyComp };
