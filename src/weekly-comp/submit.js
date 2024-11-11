const { saveData } = require("../db");
const Submission = require("./Submission");

async function handleSubmit(int) {
  const sub = new Submission(int);

  if (sub.error.length > 0) {
    await int.reply({ ephemeral: true, content: sub.error });
    return;
  }

  const reply = await int.reply({
    ephemeral: sub.showSubmitFor,
    content: sub.response.text,
    fetchReply: true,
  });

  if (sub.response.react) {
    await reply.react(sub.response.react).catch((e) => console.error(e));
  }

  await saveData(
    `INSERT INTO results (userId, username, eventId, attempts, best, average) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(userId, eventId) DO UPDATE SET username = excluded.usernmae, attempts = excluded.attempts, best = excluded.best, average = excluded.average`,
    sub.data
  );
}

module.exports = handleSubmit;
