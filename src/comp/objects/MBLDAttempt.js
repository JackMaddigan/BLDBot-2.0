const { centiToDisplay } = require("../../helpers/converters");

class MBLDAttempt {
  solved;
  unsolved;
  attempted;
  points;
  time; // seconds
  result;
  isDnf;

  constructor(num) {
    this.time = num % 100000;
    this.attempted = Math.floor((num % 100000000) / 100000);
    this.solved = Math.floor(num / 100000000);
    this.unsolved = this.attempted - this.solved;
    this.points = this.solved - this.unsolved;
    this.result = num;
    this.isDnf = this.points < 0 || this.solved <= 1;
  }

  toString() {
    return `${this.solved}/${this.attempted} in ${centiToDisplay(
      this.time * 100,
      true
    )} (${this.points} points)`;
  }

  compareTo(otherMBLDAttempt) {
    if (this.points == otherMBLDAttempt.points) {
      if (this.time == otherMBLDAttempt.time) {
        if (this.unsolved == otherMBLDAttempt.unsolved) {
          return 0;
        } else {
          return this.unsolved - otherMBLDAttempt.unsolved;
        }
      } else {
        return this.time - otherMBLDAttempt.time;
      }
    } else {
      return otherMBLDAttempt.points - this.points;
    }
  }
}

module.exports = MBLDAttempt;
