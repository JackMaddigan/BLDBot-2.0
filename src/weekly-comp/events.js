const { processBoN, BoN_Result } = require("./formats/boN");
const { processMbld, Mbld_Result } = require("./formats/mbld");

const events = {
  "333bf": {
    name: "3BLD",
    process: processBoN,
    scr: ["333ni", "0"],
    attempts: 3,
    obj: BoN_Result,
  },
  "444bf": {
    name: "4BLD",
    process: processBoN,
    scr: ["444bld", "0"],
    attempts: 3,
    obj: BoN_Result,
  },
  "555bf": {
    name: "5BLD",
    process: processBoN,
    scr: ["555bld", "60"],
    attempts: 3,
    obj: BoN_Result,
  },
  "333mbf": {
    name: "MBLD",
    process: processMbld,
    scr: ["333ni", "0"],
    attempts: 1,
    obj: Mbld_Result,
  },
  extra: { name: null, process: null, scr: null, attempts: null, obj: null },
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

module.exports = { events, eventShortNameToId, eventFormatToProcessAndObj };
