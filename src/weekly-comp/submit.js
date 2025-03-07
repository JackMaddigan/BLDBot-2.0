const { saveData } = require("../db");
const Submission = require("./Submission");

async function handleSubmit(int) {
  const sub = new Submission(int);

  if (sub.error) {
    await int.reply({ flags: 64, content: sub.error });
    return;
  }

  const reply = await int.reply({
    flags: sub.showSubmitFor ? 64 : 0,
    content: sub.response.text,
    fetchReply: true,
  });

  if (sub.response.react && !sub.showSubmitFor) {
    await reply.react(sub.response.react).catch((e) => console.error(e));
  }

  await saveData(
    `INSERT INTO results (userId, username, eventId, attempts, best, average) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(userId, eventId) DO UPDATE SET username = excluded.username, attempts = excluded.attempts, best = excluded.best, average = excluded.average`,
    sub.data
  );
}

module.exports = handleSubmit;
