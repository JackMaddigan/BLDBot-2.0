const { deleteData } = require("../db");
const { eventShortNameToId } = require("./events");

async function handleUnsubmit(int) {
  const isMod = int.member.roles.cache.has(process.env.modRoleId);
  if (!isMod) {
    await int.reply({ ephemeral: true, content: "Missing permission!" });
  }
  const user = int.options.getUser("user");
  if (!user) return;
  const eventId = int.options.getString("event");

  await deleteData(`DELETE FROM results WHERE userId=? AND eventId=?`, [
    user.id,
    eventId,
  ]);
  await int.reply({ ephemeral: true, content: "Removed successfully!" });
}

module.exports = handleUnsubmit;
