const { readData } = require("./src/db");

test();
async function test() {
  console.log(await readData(`SELECT * FROM COMMS`, []));
}
