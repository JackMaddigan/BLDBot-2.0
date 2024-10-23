const { processTimedBoN } = require("./process-timed-BoN");
const { processMBLDBoN } = require("./process-MBLD-BoN");
const { TimedBoNResult } = require("../objects/TimedBoNResult");
const { MBLDBoNResult } = require("../objects/MBLDBoNResult");

var wca_events = [
  { name: "3x3", value: "333 0" },
  { name: "2x2", value: "222so 0" },
  { name: "4x4", value: "444wca 0" },
  { name: "5x5", value: "555wca 60" },
  { name: "6x6", value: "666wca 80" },
  { name: "7x7", value: "777wca 100" },
  { name: "3BLD", value: "333ni 0" },
  { name: "3x3 FMC", value: "333fm 0" },
  { name: "3x3 OH", value: "333 0" },
  { name: "Clock", value: "clkwca 0" },
  { name: "Megaminx", value: "mgmp 70" },
  { name: "Pyraminx", value: "pyrso 10" },
  { name: "Skewb", value: "skbso 0" },
  { name: "Sq1", value: "sqrs 0" },
  { name: "4BLD", value: "444bld 0" },
  { name: "5BLD", value: "555bld 60" },
];

const eventInfo = {
  "333bf": {
    eventName: "3BLD",
    eventId: "333bf",
    eventShortName: "3bld",
    format: "TimedBoN",
    numAttempts: 3,
    process: processTimedBoN,
    resultObj: TimedBoNResult,
    scrambleArgs: ["333ni", "0"],
  },
  "444bf": {
    eventName: "4BLD",
    eventId: "444bf",
    eventShortName: "4bld",
    format: "TimedBoN",
    numAttempts: 3,
    process: processTimedBoN,
    resultObj: TimedBoNResult,
    scrambleArgs: ["444bld", "0"],
  },
  "555bf": {
    eventName: "5BLD",
    eventId: "555bf",
    eventShortName: "5bld",
    format: "TimedBoN",
    numAttempts: 3,
    process: processTimedBoN,
    resultObj: TimedBoNResult,
    scrambleArgs: ["555bld", "60"],
  },
  "333mbf": {
    eventName: "MBLD",
    eventId: "333mbf",
    eventShortName: "mbld",
    format: "MBLDBoN",
    numAttempts: 1,
    process: processMBLDBoN,
    resultObj: MBLDBoNResult,
    scrambleArgs: ["333ni", "0"],
  },
  extra: {
    eventName: null,
    eventId: "extra",
    eventShortName: "extra",
    format: null,
    numAttempts: null,
    process: null,
    resultObj: null,
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

/*
  { name: "MBLD BoX", value: "mbldbox" },
    { name: "Timed BoX", value: "timedbox" },
    { name: "Timed MoX", value: "timedmox" },
    { name: "Timed AoX", value: "timedaox" },
    { name: "FMC MoX", value: "fmcmox" }
 */

const eventFormatToProcessAndObj = {
  timedbox: { process: processTimedBoN, resultObj: TimedBoNResult },
  timedmox: { process: null, resultObj: null },
  timedaox: { process: null, resultObj: null },
  fmcmox: { process: null, resultObj: null },
  mbldbox: { process: processMBLDBoN, resultObj: MBLDBoNResult },
};

module.exports = {
  eventInfo,
  eventShortNameToId,
  wca_events,
  eventFormatToProcessAndObj,
};
