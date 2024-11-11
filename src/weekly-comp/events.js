const { processBoN, BoN_Result } = require("./formats/boN");
const { processMbld, Mbld_Result } = require("./formats/mbld");

const events = {
  "333bf": {
    name: "3BLD",
    process: processBoN,
    scr: null,
    attempts: 3,
    obj: BoN_Result,
  },
  "444bf": {
    name: "4BLD",
    process: processBoN,
    scr: null,
    attempts: 3,
    obj: BoN_Result,
  },
  "555bf": {
    name: "5BLD",
    process: processBoN,
    scr: null,
    attempts: 3,
    obj: BoN_Result,
  },
  "333mbf": {
    name: "MBLD",
    process: processMbld,
    scr: null,
    attempts: 1,
    obj: Mbld_Result,
  },
  extra: { name: null, process: null, scr: null, attempts: null, obj: null },
};

module.exports = events;
