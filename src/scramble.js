const cstimer = require("cstimer_module");

async function handleScrambleCommand(int) {
  try {
    await int.deferReply().catch((error) => console.error(error));
    const [scrCode, scrLength] = int.options.getString("event").split(" ");
    const quantity = int.options.getInteger("quantity");
    var msg = "";
    for (let i = 0; i < quantity; i++)
      msg += `${i + 1}) ${cstimer.getScramble(scrCode, scrLength)}\n`;
    await int.editReply(msg).catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  }
}

module.exports = handleScrambleCommand;
