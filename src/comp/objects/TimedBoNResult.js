const { centiToDisplay } = require("../../helpers/converters");
const emoji = require("../../helpers/emojis");

class TimedBoNResult {
  eventId;
  solves = [];
  average;
  best;
  userId;
  username;
  placing = null;
  list = "";

  constructor(eventId, solves, userId, username, dbResult) {
    if (!dbResult) {
      this.solves = solves;
      this.eventId = eventId;
      this.userId = userId;
      this.username = username;
      this.toList();
      this.calculateStats();
    } else {
      this.best = dbResult.best;
      this.average = dbResult.average;
      this.eventId = dbResult.eventId;
      this.username = dbResult.username;
      this.userId = dbResult.userId;
      this.list = dbResult.attempts;
    }
  }

  /**
   * Return -ve, 0, +ve whether a result is better or not
   * Compares the best result where smaller is better
   * @param {TimedBoNResult} otherTimedBoNResult
   */
  compareTo(otherTimedBoNResult) {
    return this.best - otherTimedBoNResult.best;
  }

  /**
   * Assign the placing of the result assuming it is in a sorted order and the lastTimedBo3Result is better
   * @param {TimedBoNResult} lastTimedBoNResult
   * @param {int} index
   */
  givePlacing(lastTimedBoNResult, index) {
    let compared = this.compareTo(lastTimedBoNResult);
    if (compared > 0) {
      // this is slower, give next placing which is index + 1
      this.placing = index + 1;
    } else if (compared == 0) {
      // equal best result to the last, give same placing as last
      this.placing = lastTimedBoNResult.placing;
    } else {
      console.error("List was not sorted correctly");
    }
  }

  /**
   * Calculate best and average using the solves array
   * Make the average 0 if there is only 1 solve
   */
  calculateStats() {
    let hasDnf = false;
    let hasSuccess = false;
    let sum = 0;
    let min = Infinity;
    for (let solve of this.solves) {
      if (solve <= 0) hasDnf = true;
      else if (solve < min) {
        min = solve;
        hasSuccess = true;
      }
      sum += solve;
    }
    this.average = hasDnf
      ? -1
      : this.solves.length < 2
      ? 0
      : Math.round(sum / this.solves.length);
    this.best = hasSuccess ? min : -1;
  }

  /**
   * Make the reply string for the bot after submitting the result
   * @param {boolean} submitFor
   * @returns string
   */
  toReplyString(submitFor) {
    let part1 = `Submitted a best single of **${centiToDisplay(this.best)}**`;
    let part2 =
      this.average > 0
        ? ` and a mean of **${centiToDisplay(this.average)}**`
        : "";
    let part3 = submitFor ? ` for <@${this.userId}>` : "";
    let part4 = this.best <= 0 ? " " + emoji.bldsob : "!";
    let part5 = `\n(${this.list})`;
    return part1 + part2 + part3 + part4 + part5;
  }

  /**
   * toList
   * @returns string list of solves foramtted and separated by comma
   */
  toList() {
    this.list = this.solves.map((solve) => centiToDisplay(solve)).join(", ");
  }

  toCurrentRankingsString() {
    return `**${centiToDisplay(this.best)}**\n-# ⤷ (${this.list})`;
  }

  toViewString() {
    return `best: **${centiToDisplay(this.best)}**\nmean: **${centiToDisplay(
      this.average
    )}**\n(${this.list})`;
  }

  getDbParameters() {
    return [
      this.userId,
      this.username,
      this.eventId,
      this.list,
      this.best,
      this.average,
    ];
  }
}

module.exports = { TimedBoNResult };
