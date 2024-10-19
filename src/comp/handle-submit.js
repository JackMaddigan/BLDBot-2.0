const Submission = require("./objects/Submission");
async function handleSubmit(int) {
  const submission = new Submission(int);
  console.log(submission);
}

module.exports = handleSubmit;
