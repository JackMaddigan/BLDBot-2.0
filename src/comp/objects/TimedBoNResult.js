class TimedBoNResult {
  eventId;
  solves = [];
  average;
  best;
  userId;
  username;
  placing = null;

  constructor(eventId, solves, userId, username) {
    this.solves = solves;
    this.eventId = eventId;
    this.userId = userId;
    this.username = username;
    this.calculateStats();
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
}

module.exports = { TimedBoNResult };
