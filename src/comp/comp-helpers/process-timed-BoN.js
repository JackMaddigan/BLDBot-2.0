const { toCenti } = require("../../helpers/converters");
const { TimedBoNResult } = require("../objects/TimedBoNResult");

/**
 * This function is called on a submission object and will return the results in a new object along with boolean valid
 * @param {array<string>} args
 */
function processTimedBoN(args, submission) {
  let errorMsgLines = [];
  if (args.length != this.numAttempts) {
    errorMsgLines.push(
      `Invalid number of attempts!\nExpected: ${this.numAttempts}, received: ${args.length}`
    );
  }

  const regex = /^(dnf|dns|\d{1,2}(:\d{1,2}){0,2}(\.\d+)?)$/i;
  for (const arg of args) {
    if (!arg.match(regex)) {
      errorMsgLines.push(`Invalid time: ${arg}`);
    }
  }

  if (errorMsgLines.length > 0) {
    // if there is an error then do not continue, return null result and error msg
    return { result: null, errorMsg: errorMsgLines.join("\n") };
  }

  // result is valid
  args = args.map((arg) => toCenti(arg));

  // make the result object
  const result = new TimedBoNResult(
    this.eventId,
    args,
    submission.userId,
    submission.username
  );
  return { result: result, errorMsg: null };
}

module.exports = { processTimedBoN };
