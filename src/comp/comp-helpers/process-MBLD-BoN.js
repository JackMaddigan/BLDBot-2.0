const { toCenti } = require("../../helpers/converters");
const { MBLDBoNResult } = require("../objects/MBLDBoNResult");

/**
 * This function is called on a submission object and will return the results in a new object along with error msg
 * @param {string} args
 * @returns results and string
 */
function processMBLDBoN(args, submission) {
  console.log(args, this);
  let errorMsgLines = [];
  const scores = [];
  const times = [];

  // split scores and times into respective arrays
  for (let i = 0; i < args.length; i++) {
    if (i % 2 == 0) {
      scores.push(args[i]);
    } else {
      times.push(args[i]);
    }
  }

  // validate the scores
  const scoresRegex = /^\d+\/\d+$/;
  const dnfDnsRegex = /^dnf|dns$/i;
  for (let score of scores) {
    if (!score.match(scoresRegex)) {
      errorMsgLines.push(`Invalid score: ${score}`);
    } else {
      const [solved, total] = score.split("/").map((str) => Number(str));
      if (solved > total) {
        errorMsgLines.push(`Invalid score: ${score}`);
      }
    }
  }

  // validate the times
  const timesRegex = /^\d{1,2}(:\d{1,2}){0,2}(\.\d+)?$/i;
  for (let time of times) {
    if (!time.match(timesRegex)) {
      errorMsgLines.push(`Invalid time: ${time}`);
    }
  }

  // validate length of scores
  if (scores.length != this.numAttempts) {
    errorMsgLines.push(
      `Invalid number of scores!\nExpected: ${this.numAttempts}, received: ${scores.length}`
    );
  }

  // validate length of times
  if (times.length != this.numAttempts) {
    errorMsgLines.push(
      `Invalid number of times!\nExpected: ${this.numAttempts}, received: ${times.length}`
    );
  }

  // return null result and error message
  if (errorMsgLines.length > 0) {
    return { result: null, errorMsg: errorMsgLines.join("\n") };
  }

  // turn all attempts to numbers
  const attemptNumbers = [];
  for (let i = 0; i < this.numAttempts; i++) {
    // AAABBBCCCCC where A=solved, B=total, C=seconds
    const secStr = Math.round(toCenti(times[i]) / 100)
      .toString()
      .padStart(5, "0");
    const [solved, attempted] = scores[i]
      .split("/")
      .map((item) => item.padStart(3, "0"));
    attemptNumbers.push(solved + attempted + secStr);
  }

  console.log(attemptNumbers);
  const result = new MBLDBoNResult(
    this.eventId,
    attemptNumbers,
    submission.userId,
    submission.username
  );

  return { result: result, errorMsg: null };
}

module.exports = { processMBLDBoN };
