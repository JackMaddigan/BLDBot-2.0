const Submission = require("./objects/Submission");
async function handleSubmit(int) {
  const submission = new Submission(int);
  console.log(submission);
  if (submission.errorMsg != null) {
    await int.reply({ ephemeral: true, content: submission.errorMsg });
    return;
  }
  await int.reply({
    ephemeral: true,
    content: submission.result.toReplyString(submission.showSubmitFor),
  });
}

module.exports = handleSubmit;
