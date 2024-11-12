const { processBoN, BoN_Result } = require("./formats/boN");
const { processMbld, Mbld_Result } = require("./formats/mbld");

const events = {
  "333bf": {
    name: "3BLD",
    short: "3bld",
    process: processBoN,
    scr: ["333ni", "0"],
    attempts: 3,
    obj: BoN_Result,
  },
  "444bf": {
    name: "4BLD",
    short: "4bld",
    process: processBoN,
    scr: ["444bld", "0"],
    attempts: 3,
    obj: BoN_Result,
  },
  "555bf": {
    name: "5BLD",
    short: "5bld",
    process: processBoN,
    scr: ["555bld", "60"],
    attempts: 3,
    obj: BoN_Result,
  },
  "333mbf": {
    name: "MBLD",
    short: "mbld",
    process: processMbld,
    scr: ["r3ni", "75"],
    attempts: 1,
    obj: Mbld_Result,
  },
  extra: {
    name: null,
    short: "extra",
    process: null,
    scr: null,
    attempts: null,
    obj: null,
  },
};

const eventShortNameToId = {
  "3bld": "333bf",
  "4bld": "444bf",
  "5bld": "555bf",
  mbld: "333mbf",
  extra: "extra",
};

const eventFormatToProcessAndObj = {
  timedbon: { process: processBoN, obj: BoN_Result },
  timedmon: { process: null, obj: null },
  timedaon: { process: null, obj: null },
  fmcmon: { process: null, obj: null },
  mbld: { process: processMbld, obj: Mbld_Result },
};

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

module.exports = {
  events,
  eventShortNameToId,
  eventFormatToProcessAndObj,
  wca_events,
};
