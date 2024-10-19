const { processTimedBoN } = require("./process-timed-BoN");
const { processMBLDBoN } = require("./process-MBLD-BoN");

const eventInfo = {
  "333bf": {
    eventName: "3BLD",
    eventId: "333bf",
    format: "TimedBoN",
    numAttempts: 3,
    process: processTimedBoN,
  },
  "444bf": {
    eventName: "4BLD",
    eventId: "444bf",
    format: "TimedBoN",
    numAttempts: 3,
    process: processTimedBoN,
  },
  "555bf": {
    eventName: "5BLD",
    eventId: "555bf",
    format: "TimedBoN",
    numAttempts: 3,
    process: processTimedBoN,
  },
  "333mbf": {
    eventName: "MBLD",
    eventId: "333mbf",
    format: "MBLDBoN",
    numAttempts: 1,
    process: processMBLDBoN,
  },
  extra: {
    eventName: null,
    eventId: null,
    format: null,
    numAttempts: null,
    process: null,
  },
};

// only for use converting the subcommand name to the event id
const eventShortNameToId = {
  "3bld": "333bf",
  "4bld": "444bf",
  "5bld": "555bf",
  mbld: "333mbf",
  extra: "extra",
};

module.exports = { eventInfo, eventShortNameToId };
