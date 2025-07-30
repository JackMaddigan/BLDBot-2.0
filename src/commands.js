const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { events, wca_events } = require("../src/weekly-comp/events");

async function registerCommands(client) {
  try {
    const submitCommand = new SlashCommandBuilder()
      .setName("submit")
      .setDescription("Submit results for the weekly comp!");
    for (const eventId in events) {
      if (eventId === "extra") continue;
      const event = events[eventId];
      submitCommand.addSubcommand((sub) =>
        sub
          .setName(event.short)
          .setDescription(`Submit results for ${event.short}`)
          .addStringOption((option) =>
            option
              .setName("results")
              .setDescription("Enter your results separated by a space")
              .setRequired(true)
          )
          .addUserOption((option) =>
            option
              .setName("submit-for")
              .setDescription("The user")
              .setRequired(false)
          )
      );
    }

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
            Object.entries(events).map(([eventId, event]) => ({
              name: event.short || eventId,
              value: eventId,
            }))
          )
      );

    const howCommand = new SlashCommandBuilder()
      .setName("how")
      .setDescription("Search the comm exec thread")
      .addStringOption((option) =>
        option.setName("find").setRequired(true).setDescription("Search for...")
      );

    const howHelpCommand = new SlashCommandBuilder()
      .setName("video-search-help")
      .setDescription("Get help using /how");

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
                { name: "MBLD", value: "mbld" },
                { name: "Timed BoN", value: "timedbon" }
              )
          )
          .addIntegerOption((option) =>
            option
              .setName("attempts")
              .setDescription("Number of solves or attempts")
              .setRequired(true)
          )
      ).addSubcommand((sub) =>
        sub
          .setName("clear-results")
          .setDescription("Clear all current results")
      ).addSubcommand((sub) =>
        sub
          .setName("post-results")
          .setDescription("Post current results")
      ).addSubcommand((sub) =>
        sub
          .setName("send-scrambles")
          .setDescription("Post new week and scrambles")
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
      howHelpCommand,
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
