const { deleteData } = require("../db");
const roles = require("../helpers/roles");

async function handleUnsubmit(int) {
  // check user has mod permission, although this command should only be visible to mod anyway
  const isMod = int.guild.members.cache
    .get(int.user.id)
    .roles.cache.has(roles.mod);
  if (!isMod) {
    await int.reply({ ephemeral: true, content: "Missing permission!" });
  }
  // get user and eventId
  const user = int.options.getUser("user");
  if (!user) return;
  const eventId = int.options.getString("event");
  // remove from db

  await deleteData(`DELETE FROM results WHERE userId=? AND eventId=?`, [
    user.id,
    eventId,
  ]);
  // reply
  await int.reply({ ephemeral: true, content: "Removed successfully!" });
}

module.exports = handleUnsubmit;
