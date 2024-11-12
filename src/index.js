require("dotenv").config();

const { Client, IntentsBitField } = require("discord.js");
const { registerCommands } = require("./commands");
const runSummary = require("./bld-summary/bld-summary");
const cron = require("node-cron");
const { readData } = require("./db");

// Weekly Comp imports
const { eventFormatToProcessAndObj, events } = require("./weekly-comp/events");
const { handleCurrentRankings } = require("./weekly-comp/results");
const handleSubmit = require("./weekly-comp/submit");
const { handleCompCommand, handleWeeklyComp } = require("./weekly-comp/comp");
const handleView = require("./weekly-comp/view");
const handleUnsubmit = require("./weekly-comp/unsubmit");
const fetchRecords = require("./records/records");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", async (bot) => {
  console.log(bot.user.username + " is online!");
  try {
    await onStartUp();
    await fetchRecords(client);
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (int) => {
  try {
    switch (int.commandName) {
      case "submit":
        await handleSubmit(int);
        break;
      case "cr":
        await handleCurrentRankings(int);
        break;
      case "view":
        await handleView(int);
        break;
      case "unsubmit":
        await handleUnsubmit(int);
        break;
      case "comp":
        await handleCompCommand(int, client);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
});

client.on("messageDelete", async (msg) => {
  if (msg.author.bot) return;
});

client.on("messageUpdate", async (msg) => {
  if (msg.author.bot) return;
});

async function onStartUp() {
  try {
    // load extra event info from db into eventInfo if it exists
    const extraEventInfo = await readData(
      `SELECT * FROM key_value_store WHERE key=? LIMIT 1`,
      ["extraEventInfo"]
    );
    if (extraEventInfo.length == 1) {
      const obj = JSON.parse(extraEventInfo[0].value);
      const processInfo = eventFormatToProcessAndObj[obj.format];
      obj.process = processInfo.process;
      obj.obj = processInfo.obj;
      events.extra = obj;
      console.log(events.extra);
    }
  } catch (error) {
    console.error("Error loading start up data: ", error);
  }
}

// Cron Jobs to handle weekly comp and weekly comp warning
cron.schedule("0 1 * * 0", async () => {
  console.log("0100 Handling Comp");
  try {
    // Handle comp
    await handleWeeklyComp(client);
  } catch (error) {
    console.error("Error Handling Comp", error);
  }
});

cron.schedule("0 0 * * 0", () => {
  try {
    const adminChannel = client.channels.cache.get(process.env.adminChannelId);
    adminChannel.send("Results and new scrambles will be posted in one hour!");
  } catch (error) {
    console.error("Error", error);
  }
});

client.login(process.env.token);
