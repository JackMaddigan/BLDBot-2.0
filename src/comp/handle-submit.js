const { saveData } = require("../db");
const Submission = require("./objects/Submission");
async function handleSubmit(int) {
  try {
    const submission = new Submission(int);
    if (submission.errorMsg != null) {
      await int.reply({ ephemeral: true, content: submission.errorMsg });
      return;
    }
    const reply = await int.reply({
      content: submission.result.toReplyString(submission.showSubmitFor),
      fetchReply: true,
    });

    if (submission.reactionEmoji)
      await reply
        .react(submission.reactionEmoji)
        .catch((e) => console.error(e));

    await saveData(
      `INSERT INTO results (userId, username, eventId, attempts, best, average)
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT(userId, eventId) DO UPDATE SET attempts = excluded.attempts, best = excluded.best, average = excluded.average`,
      submission.result.getDbParameters()
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = handleSubmit;
