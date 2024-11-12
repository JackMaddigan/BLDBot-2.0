const { toCenti, centiToDisplay } = require("../../helpers/converters");
const emoji = require("../../helpers/emojis");

/**
 * Validate Mbld result text, return array of [data, error, response]
 * Data is a 3 item long array of the columns of data to save to db
 * attempts, best, average
 */
function processMbld(resultText, sub) {
  const chunks = resultText.split(/[ ,]+/);
  let scores = [];
  let times = [];
  for (let i = 0; i < chunks.length; i++) {
    if (i % 2 === 0) {
      scores.push(chunks[i]);
    } else {
      times.push(chunks[i]);
    }
  }
  let errors = [];

  // validate number of scores and attempts
  if (scores.length < 1 || scores.length > sub.event.attempts) {
    errors.push(
      `Invalid number of scores!\nExpected: 1-${sub.event.attempts}, received: ${scores.length}`
    );
  }
  if (times.length < 1 || times.length > sub.event.attempts) {
    errors.push(
      `Invalid number of times!\nExpected: 1-${sub.event.attempts}, received: ${times.length}`
    );
  }
  if (scores.length !== times.length) {
    errors.push(`Number of scores and times do not match!`);
  }

  // validate the scores
  const scoresRegex = /^\d+\/\d+$/;
  for (let score of scores) {
    if (!score.match(scoresRegex)) {
      errors.push(`Invalid score: ${score}`);
    } else {
      const [solved, total] = score.split("/").map((str) => Number(str));
      if (solved > total) {
        errors.push(`Invalid score: ${score}`);
      }
    }
  }

  // validate the times
  const timesRegex = /^\d{1,2}(:\d{1,2}){0,2}(\.\d+)?$/i;
  for (let time of times) {
    if (!time.match(timesRegex)) {
      errors.push(`Invalid time: ${time}`);
    }
  }

  if (errors.length > 0) {
    return [[], errors.join("\n"), {}];
  }

  const attempts = [];
  for (let i = 0; i < scores.length; i++) {
    attempts.push(new Mbld_Attempt(null, scores[i], times[i]));
  }
  const list = attempts.map((attempt) => attempt.toShortString()).join(", ");
  attempts.sort((a, b) => a.compare(b));

  const best = attempts[0];
  const react = best.isDnf
    ? " " + emoji.bldsob
    : best.seconds < 3120
    ? " " + emoji.morecubes
    : null;
  const data = [list, best.num, null];
  const a = `Submitted a best result of ${best.toReplyString()}`;
  const b = react || "";
  const c = sub.showSubmitFor ? ` for <@${sub.userId}>` : "";

  return [data, null, { text: a + b + c, react: react }];
}

class Mbld_Attempt {
  num;
  solved;
  attempted;
  seconds;
  isDnf;
  constructor(num, score, time) {
    if (num) {
      this.num = num;
      this.decode();
      return;
    }
    const [solved, attempted] = score.split("/").map((part) => Number(part));
    // DDDTTTTTMMM
    this.solved = solved;
    this.attempted = attempted;
    this.seconds = Math.round(toCenti(time) / 100);
    this.isDnf = solved - (attempted - solved) < 0 || solved <= 1;
    if (this.isDnf) {
      this.num = -1;
      return;
    }
    const DDD =
      999 - (solved - (attempted - solved)).toString().padStart(3, "0"); // 999 - (solved - missed)
    const TTTTT = this.seconds.toString().padStart(5, "0"); // seconds
    const MMM = (attempted - solved).toString().padStart(3, "0");
    this.num = Number(DDD + TTTTT + MMM);
  }

  decode() {
    if (this.num < 0) {
      this.isDnf = true;
      return;
    }
    const missed = this.num % 1000;
    const difference = 999 - Math.floor(this.num / 1e8);
    this.seconds = Math.floor((this.num % 1e7) / 1000);
    this.solved = difference + missed;
    this.attempted = this.solved + missed;
    this.isDnf =
      this.solved - (this.attempted - this.solved) < 0 || this.solved <= 1;
  }

  compare(other) {
    return this.num - other.num;
  }

  toShortString() {
    return this.isDnf
      ? "DNF"
      : `${this.solved}/${this.attempted} ${centiToDisplay(
          this.seconds * 100,
          true
        )}`;
  }

  toInString() {
    return this.isDnf
      ? "DNF"
      : `**${this.solved}/${this.attempted}** in **${centiToDisplay(
          this.seconds * 100,
          true
        )}**`;
  }

  toReplyString() {
    return `**${this.solved}/${this.attempted}** in **${centiToDisplay(
      this.seconds * 100,
      true
    )}** (${
      this.isDnf
        ? "DNF"
        : this.solved - (this.attempted - this.solved) + " points"
    })`;
  }
}

class Mbld_Result {
  placing;
  constructor(userId, username, eventId, list, best) {
    this.userId = userId;
    this.username = username;
    this.eventId = eventId;
    this.list = list;
    this.best = new Mbld_Attempt(best);
    this.average = null;
    this.isDnf = best <= 0;
  }

  compare(other) {
    return this.best.compare(other.best);
  }

  givePlacing(inFront, index) {
    if (inFront.compare(this) < 0) {
      this.placing = index + 1;
    } else {
      this.placing = inFront.placing;
    }
  }

  toViewString() {
    return this.best.toShortString();
  }

  toCRString() {
    return `#${this.placing} ${this.username} **${this.best.toShortString()}**`;
  }

  toTxtFileString() {
    return `#${this.placing} ${this.username} ${this.best.toShortString()}`;
  }

  toPodiumString() {
    const medals = [":first_place:", ":second_place:", ":third_place:"];
    return `${medals[this.placing - 1]} <@${
      this.userId
    }> ${this.best.toInString()}
    `;
  }
}

module.exports = {
  processMbld,
  Mbld_Result,
};
