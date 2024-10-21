require("dotenv").config();

const { Client, IntentsBitField } = require("discord.js");
const { registerCommands } = require("./commands");
const handleSubmit = require("./comp/handle-submit");
const { currentRankings } = require("./comp/rankings");
const { handleView } = require("./comp/view");

const cron = require("node-cron");
const handleUnsubmit = require("./comp/handle-unsubmit");

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
  // registerCommands(client);
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
  // load extra event info from db
}

client.login(process.env.token);
