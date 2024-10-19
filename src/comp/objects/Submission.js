const roles = require("../../helpers/roles.js");
const {
  eventInfo,
  eventShortNameToId,
} = require("../comp-helpers/event-info.js");

class Submission {
  result;
  showSubmitFor = false;
  userId;
  username;
  eventId;
  errorMsg;

  constructor(int) {
    this.addUserDetails(int);
    this.addResult(int);
  }

  addUserDetails(int) {
    const isMod = this.checkMod(int);
    const submitForUser = int.options.getUser("submit-for");
    if (isMod && submitForUser != null) {
      // is mod and there is a user to submit for
      this.userId = submitForUser.id;
      this.username = submitForUser.username;
      this.showSubmitFor = true;
    } else {
      // submitting for self
      this.userId = int.user.id;
      this.username = int.user.username;
    }
  }

  addResult(int) {
    this.eventId = eventShortNameToId[int.options.getSubcommand()];
    // process results
    const args = int.options.getString("results").split(/[\s,]+/);
    // use the processing function from the eventInfo file for the particular event, returns the result object and then the error message, result object is null if error message
    const { result, errorMsg } = eventInfo[this.eventId].process(args, this);
    this.result = result;
    this.errorMsg = errorMsg;
  }

  checkMod(int) {
    console.log(roles.mod);
    return int.guild.members.cache.get(int.user.id).roles.cache.has(roles.mod);
  }
}

module.exports = Submission;
