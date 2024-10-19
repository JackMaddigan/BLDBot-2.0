const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

var wca_events = [
  { name: "3x3", value: "333 0" },
  { name: "2x2", value: "222so 0" },
  { name: "4x4", value: "444wca 0" },
  { name: "5x5", value: "555wca 60" },
  { name: "6x6", value: "666wca 80" },
  { name: "7x7", value: "777wca 100" },
  { name: "3BLD", value: "333ni 0" },
  { name: "3x3 FMC", value: "333fm 0" },
  { name: "3x3 OH", value: "333 0" },
  { name: "Clock", value: "clkwca 0" },
  { name: "Megaminx", value: "mgmp 70" },
  { name: "Pyraminx", value: "pyrso 10" },
  { name: "Skewb", value: "skbso 0" },
  { name: "Sq1", value: "sqrs 0" },
  { name: "4BLD", value: "444bld 0" },
  { name: "5BLD", value: "555bld 60" },
];

async function registerCommands(client) {
  try {
    // Define your slash commands
    const submitCommand = new SlashCommandBuilder()
      .setName("submit")
      .setDescription("Submit results for the weekly comp!")
      .addSubcommand((sub) =>
        sub
          .setName("3bld")
          .setDescription("Submit results for 3BLD")
          .addStringOption((option) =>
            option
              .setName("results")
              .setDescription("Enter your times separated by a space")
              .setRequired(true)
          )
          .addUserOption((option) =>
            option
              .setName("submit-for")
              .setDescription("The user")
              .setRequired(false)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("4bld")
          .setDescription("Submit results for 4BLD")
          .addStringOption((option) =>
            option
              .setName("results")
              .setDescription("Enter your times separated by a space")
              .setRequired(true)
          )
          .addUserOption((option) =>
            option
              .setName("submit-for")
              .setDescription("The user")
              .setRequired(false)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("5bld")
          .setDescription("Submit results for 5BLD")
          .addStringOption((option) =>
            option
              .setName("results")
              .setDescription("Enter your times separated by a space")
              .setRequired(true)
          )
          .addUserOption((option) =>
            option
              .setName("submit-for")
              .setDescription("The user")
              .setRequired(false)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("mbld")
          .setDescription("Submit results for MBLD")
          .addStringOption((option) =>
            option
              .setName("results")
              .setDescription("For example 11/13 53:00")
              .setRequired(true)
          )
          .addUserOption((option) =>
            option
              .setName("submit-for")
              .setDescription("The user")
              .setRequired(false)
          )
      )
      .addSubcommand((extra) =>
        extra
          .setName("extra")
          .setDescription("Submit results for the extra event")
          .addStringOption((option) =>
            option
              .setName("results")
              .setDescription("Times or results separated by a space")
              .setRequired(true)
          )
          .addUserOption((option) =>
            option
              .setName("submit-for")
              .setDescription("The user")
              .setRequired(false)
          )
      );

    const unsubmitCommand = new SlashCommandBuilder()
      .setName("unsubmit")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .setDescription("Unsubmit results")
      .addUserOption((option) =>
        option.setName("user").setRequired(true).setDescription("The user")
      )
      .addStringOption((option) =>
        option
          .setName("event")
          .setRequired(true)
          .setDescription("Event to unsubmit")
          .setChoices(
            { name: "3BLD", value: "3bld" },
            { name: "4BLD", value: "4bld" },
            { name: "5BLD", value: "5bld" },
            { name: "MBLD", value: "mbld" },
            { name: "Extra Event", value: "extra" }
          )
      );

    const howCommand = new SlashCommandBuilder()
      .setName("how")
      .setDescription("Search the comm exec thread")
      .addStringOption((option) =>
        option.setName("find").setRequired(true).setDescription("Search for...")
      );

    const readCommsCommand = new SlashCommandBuilder()
      .setName("read-comms")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .setDescription("Save all messages in comm thread");

    const viewCommand = new SlashCommandBuilder()
      .setName("view")
      .setDescription("See your weekly comp submissions");

    const scrambleCommand = new SlashCommandBuilder()
      .setName("scramble")
      .setDescription("Get a scramble")
      .addStringOption((option) =>
        option
          .setChoices(wca_events)
          .setName("event")
          .setDescription("Event")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setChoices(
            { name: "1", value: 1 },
            { name: "2", value: 2 },
            { name: "3", value: 3 },
            { name: "4", value: 4 },
            { name: "5", value: 5 }
          )
          .setName("quantity")
          .setDescription("Number of scrambles")
          .setRequired(true)
      );

    const currentRankingsCommand = new SlashCommandBuilder()
      .setName("cr")
      .setDescription("See the current competition rankings");

    const weeklyCompCommand = new SlashCommandBuilder()
      .setName("comp")
      .setDescription("Weekly Comp")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .addSubcommand((sub) =>
        sub.setName("end-extra-event").setDescription("End the extra event")
      )
      .addSubcommand((sub) =>
        sub
          .setName("start-extra-event")
          .setDescription("Set up an extra event")
          .addStringOption((option) =>
            option
              .setName("name")
              .setDescription("Name of the extra event")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("format")
              .setDescription("Format of the event")
              .setRequired(true)
              .setChoices(
                { name: "MBLD", value: "2" },
                { name: "Timed", value: "1" }
              )
          )
          .addIntegerOption((option) =>
            option
              .setName("attempts")
              .setDescription("Number of solves or attempts")
              .setRequired(true)
          )
      );

    // Register the slash commands
    await client.application.commands.set([
      submitCommand,
      unsubmitCommand,
      currentRankingsCommand,
      viewCommand,
      weeklyCompCommand,
      scrambleCommand,
      howCommand,
      readCommsCommand,
    ]);
    console.log("Slash commands registered successfully.");
  } catch (error) {
    console.error("Failed to register slash commands:", error);
  }
}

module.exports = {
  registerCommands,
};
