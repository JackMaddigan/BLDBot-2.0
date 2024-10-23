require("dotenv").config();

const { Client, IntentsBitField } = require("discord.js");
const { registerCommands } = require("./commands");
const handleSubmit = require("./comp/handle-submit");
const { currentRankings } = require("./comp/rankings");
const { handleView } = require("./comp/view");
const { handleCompCommand, handleWeeklyComp } = require("./comp/comp");

const cron = require("node-cron");
const handleUnsubmit = require("./comp/handle-unsubmit");
const { readData } = require("./db");
const {
  eventInfo,
  eventFormatToProcessAndObj,
} = require("./comp/comp-helpers/event-info");

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
  await onStartUp();
  // await handleWeeklyComp(client);
  // await registerCommands(client);
});

client.on("interactionCreate", async (int) => {
  try {
    switch (int.commandName) {
      case "submit":
        await handleSubmit(int);
        break;
      case "cr":
        await currentRankings(int);
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
      obj.resultObj = processInfo.resultObj;
      eventInfo.extra = obj;
    }
  } catch (error) {
    console.error("Error loading start up data: ", error);
  }
}

client.login(process.env.token);
