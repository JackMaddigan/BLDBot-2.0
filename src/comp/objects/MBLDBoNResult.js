const { centiToDisplay } = require("../../helpers/converters");
const emoji = require("../../helpers/emojis");
const MBLDAttempt = require("./MBLDAttempt");

class MBLDBoNResult {
  eventId;
  solves = [];
  best;
  userId;
  username;
  placing = null;
  list = "";

  constructor(eventId, solves, userId, username, dbResult) {
    // solves is an array of mbld objects
    if (!dbResult) {
      this.solves = solves.map((num) => new MBLDAttempt(num));
      this.eventId = eventId;
      this.userId = userId;
      this.username = username;
      this.toList();
      this.calculateStats();
    } else {
      // result from the db
      this.best = new MBLDAttempt(dbResult.best);
      this.average = null;
      this.eventId = dbResult.eventId;
      this.username = dbResult.username;
      this.userId = dbResult.userId;
      this.list = dbResult.attempts;
    }
  }

  /**
   * Return -ve, 0, +ve whether a result is better or not
   * Compares the best result
   * @param {*}
   */
  compareTo(otherMBLDBoNResult) {
    // use the method already in MBLDAttempt
    return this.best.compareTo(otherMBLDBoNResult.best);
  }

  /**
   * Assign the placing of the result assuming it is in a sorted order and the lastTimedBo3Result is better
   * @param {*}
   * @param {int} index
   */
  givePlacing(lastMBLDBoNResult, index) {
    let compared = this.compareTo(lastMBLDBoNResult);
    if (compared > 0) {
      // this is slower, give next placing which is index + 1
      this.placing = index + 1;
    } else if (compared == 0) {
      // equal best result to the last, give same placing as last
      this.placing = lastMBLDBoNResult.placing;
    } else {
      console.error("List was not sorted correctly");
    }
  }

  /**
   * Calculate best using and ranking solves array and getting the first
   */
  calculateStats() {
    const sortedSolves = this.solves.slice().sort((a, b) => a.compareTo(b));
    this.best = sortedSolves[0];
  }

  /**
   * Make the reply string for the bot when submitting the result
   * @param {boolean} submitFor
   * @returns string
   */
  toReplyString(submitFor) {
    let part1 = `Submitted a best result of **${this.best.toString()}**`;
    let part2 = submitFor ? ` for <@${this.userId}>` : "";
    let part3 = this.best.isDnf
      ? " " + emoji.bldsob
      : this.best.time < 3240
      ? " " + emoji.morecubes
      : "";
    let part4 = this.solves.length > 1 ? `\n(${this.list})` : "";
    return part1 + part2 + part3 + part4;
  }

  /**
   * toList
   * @returns string list of formatted solves
   */
  toList() {
    this.list = this.solves.map((solve) => solve.toString(solve)).join(", ");
  }

  toCurrentRankingsString() {
    // *\n-# ⤷(${this.list}) not included
    return `**${this.best.toBasicString()}**`;
  }

  toViewString() {
    return `**${this.best.toBasicString()}**`;
  }

  /**
   * Return the values that get saved to db
   * @returns array of items to save to db
   */
  getDbParameters() {
    return [
      this.userId,
      this.username,
      this.eventId,
      this.list,
      this.best.num,
      null,
    ];
  }
}

module.exports = { MBLDBoNResult };
