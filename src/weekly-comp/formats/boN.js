const { toCenti, centiToDisplay } = require("../../helpers/converters");
const emoji = require("../../helpers/emojis");

/**
 * Validate boN result text, return array of [data, error, response]
 * Data is a 3 item long array of the columns of data to save to db
 * attempts, best, average
 */
function processBoN(resultText, sub) {
  let solves = resultText.split(/[ ,]+/);
  let errors = [];
  if (solves.length != sub.event.attempts) {
    errors.push(
      `Invalid number of attempts!\nExpected: ${sub.event.attempts}, received: ${solves.length}`
    );
  }

  const regex = /^(dnf|dns|\d{1,2}(:\d{1,2}){0,2}(\.\d+)?)$/i;
  for (const solve of solves) {
    if (!solve.match(regex)) {
      errors.push(`Invalid time: ${solve}`);
    }
  }

  if (errors.length > 0) {
    return [[], errors.join("\n"), {}];
  }
  solves = solves.map((solve) => toCenti(solve));
  const list = solves.map((solve) => centiToDisplay(solve)).join(", ");

  solves = solves.sort((a, b) => a - b).filter((item) => item > 0);
  const best = solves.length === 0 ? -1 : solves[0];

  const sum = solves.reduce((acc, curr) => acc + curr, 0);
  const average =
    solves.length === sub.event.attempts ? Math.round(sum / solves.length) : -1;

  const data = [list, best, average];
  const react = best < 0 ? emoji.bldsob : null;
  const a = `Submitted a best single of **${centiToDisplay(best)}**`;
  const b = average > 0 ? ` and a mean of **${centiToDisplay(average)}**` : "";
  const c = sub.showSubmitFor ? ` for <@${sub.userId}>` : "";
  const d = best < 0 ? " " + emoji.bldsob : "";
  const e = `\n(*${list}*)`;
  const response = { text: a + b + c + d + e, react: react };
  return [data, null, response];
}

/**
 * Make result object from info from db
 */
class BoN_Result {
  placing;
  constructor(userId, username, eventId, list, best, average) {
    this.userId = userId;
    this.username = username;
    this.eventId = eventId;
    this.list = list;
    this.best = best;
    this.average = average;
    this.isDnf = best <= 0;
  }

  compare(other) {
    return this.best - other.best;
  }

  givePlacing(inFront, index) {
    if (inFront.compare(this) < 0) {
      this.placing = index + 1;
    } else {
      this.placing = inFront.placing;
    }
  }

  toViewString() {
    return `Best: **${centiToDisplay(this.best)}**\nAverage: **${centiToDisplay(
      this.average
    )}**\n(*${this.list}*)`;
  }

  toCRString() {
    return `#${this.placing} ${this.username} **${centiToDisplay(
      this.best
    )}**\n⤷(*${this.list}*)${
      this.average > 0 ? ` Mean: ${centiToDisplay(this.average)}` : ""
    }`;
  }

  toTxtFileString() {
    return `\n#${this.placing} ${this.username} ${centiToDisplay(
      this.best
    )}\n⤷(${this.list})${
      this.average > 0 ? ` Mean: ${centiToDisplay(this.average)}` : ""
    }`;
  }

  toPodiumString() {
    const medals = [":first_place:", ":second_place:", ":third_place:"];
    return `\n${medals[this.placing - 1]} <@${this.userId}> **${centiToDisplay(
      this.best
    )}**\n-# *(${this.list})*${
      this.average > 0 ? ` Mean: ${centiToDisplay(this.average)}` : ""
    }`;
  }
}

module.exports = {
  processBoN,
  BoN_Result,
};
