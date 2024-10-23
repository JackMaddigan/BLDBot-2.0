const { toCenti } = require("../../helpers/converters");
const emoji = require("../../helpers/emojis");
const { MBLDBoNResult } = require("../objects/MBLDBoNResult");

/**
 * This function is called on a submission object and will return the results in a new object along with error msg
 * @param {string} args
 * @returns results and string
 */
function processMBLDBoN(args, submission) {
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
  if (scores.length > this.numAttempts || scores.length < 1) {
    errorMsgLines.push(
      `Invalid number of scores!\nExpected: ${this.numAttempts}, received: ${scores.length}`
    );
  }

  // validate length of times
  if (
    times.length > this.numAttempts ||
    scores.length < 1 ||
    scores.length !== times.length
  ) {
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
  for (let i = 0; i < times.length; i++) {
    // removed this.numAttempts so you dont have to submit all attempts
    // AAABBBCCCCC where A=solved, B=total, C=seconds
    const secStr = Math.round(toCenti(times[i]) / 100)
      .toString()
      .padStart(5, "0");
    const [solved, attempted] = scores[i]
      .split("/")
      .map((item) => item.padStart(3, "0"));
    attemptNumbers.push(solved + attempted + secStr);
  }

  const result = new MBLDBoNResult(
    this.eventId,
    attemptNumbers,
    submission.userId,
    submission.username
  );

  return {
    result: result,
    errorMsg: null,
    reactionEmoji: result.isDnf
      ? emoji.bldsob
      : result.best.time < 3240
      ? emoji.morecubes
      : null,
  };
}

module.exports = { processMBLDBoN };
