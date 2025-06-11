const { EmbedBuilder } = require("@discordjs/builders");
const { readData, saveData } = require("../db");

const edgePieces = new Set(["UB","UR","UF","UL","LU","LF","LD","LB","FU","FR","FD","FL","RU","RB","RD","RF","BU","BL","BD","BR","DF","DR","DB","DL"]);
const cornerPieces = new Set(["UBL","UBR","UFR","UFL","LUB","LUF","LDF","LDB","FUL","FUR","FDR","FDL","RUF","RUB","RDB","RDF","BUR","BUL","BDL","BDR","DFL","DFR","DBR","DBL"]);


const cornerCommRegex = /^[UFRBLD]{3}\s+[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/;
const edgeCommRegex = /^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{2}\s*$/;
const cornerSetRegex = /^[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/;
const edgeSetRegex = /^[UFRBLD]{2}\s+[UFRBLD]{2}\s*$/;
const parityRegex =
  /^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/;
const paritySetRegex = /^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{3}\s*$/;
const ltctRegex =
  /^(([UFRBLD]{2}\s+){2})?[UFRBLD]{3}\s+[UFRBLD]{3}\s*\[[UFRBLD]{3}\]\s*$/;
const ltctSetRegex =
  /^(([UFRBLD]{2}\s+){2})?[UFRBLD]{3}\s+[UFRBLD]{3}\s*\[\s*$/;
const link = process.env.commChannelLink;

async function handleHow(int) {
  const ephemeral = int.channel.id === process.env.commChannelId;
  const n = "[UFRBLDufrbld]"; // the valid letters for the GLOB
  let term = correctOrder(
    int.options.getString("find").replaceAll(/[\s-]+/g, " ")
  ).trim();
  const isCornerComm = cornerCommRegex.test(term);
  const isEdgeComm = edgeCommRegex.test(term);
  const isCornerSet = cornerSetRegex.test(term);
  const isEdgeSet = edgeSetRegex.test(term);
  const isParity = parityRegex.test(term);
  const isParitySet = paritySetRegex.test(term);
  const isLtct = ltctRegex.test(term);
  const isLtctSet = ltctSetRegex.test(term);

  const searchTerm = term
    .replace(/\[(?!\[)/g, "[[]") // Replace "[" only if not followed by "["
    .replace(/(?<!\[)\]/g, "[]]"); // Replace "]" only if not preceded by "["

  let args = [];
  if (isCornerComm || isEdgeComm || isLtct || isParity) {
    args = [`*${searchTerm}*`];
  } else if (isCornerSet) {
    args = [`*${searchTerm} ${n}${n}${n}[( ]*`];
  } else if (isEdgeSet) {
    args = [`*${searchTerm} ${n}${n}[( ]*`];
  } else args = [`*${searchTerm}*`];
  const query = `SELECT * FROM comms WHERE content GLOB ? LIMIT 50`;
  let data = await readData(query, args);
  // filter out where contains square brackets for parity
  if (isParity || isParitySet) {
    data = data.filter((item) => !/[\[\]]/.test(item.content));
  }
  let text = "";
  if ((isCornerSet || isEdgeSet || isParitySet || isLtctSet) && data.length > 0) {
    // set of options for next piece
    const set = isEdgeSet ? edgePieces : cornerPieces;
    let orderedChunks = new Set(term.split(/\s+/).map((chunk) => chunk.split("").sort().join("")));
    for (const sticker of set) {
      if (checkIfContains(orderedChunks, sticker) || (isLtctSet && ["U", "D"].includes(sticker[0]))){continue;}
      const thisComm = isLtctSet ? `${term}${sticker}]` : `${term} ${sticker}`;
      const links = data
        .filter((item) => item.content.includes(thisComm))
        .map((match) => `[link](${link}${match.message_id})`)
        .join(" ");
      text += `${isLtctSet ? `[${sticker}]` : thisComm} ${links}\n`;
    }
    if (text.length > 4096) text = "Too many results!";
    const embed = new EmbedBuilder()
      .setColor(0x7289dd)
      .setTitle(term)
      .setDescription(text);
    await int.reply({ flags: ephemeral ? 64 : 0, embeds: [embed] });
    return;
  }
  // not a set, just return all the matches
  for (const match of data) text += `${link}${match.message_id}\n`;
  if (text.length > 2000) text = "Too many results!";
  else if (text.length === 0) text = `No video for ${term} yet!`;
  await int.reply({ flags: ephemeral ? 64 : 0, content: text });
}

function checkIfContains(chunks, sticker) {
  const orderedSticker = sticker.split("").sort().join("");
  return chunks.has(orderedSticker);
}

function correctOrder(term) {
  const priorityOrder = { U: 0, D: 1, F: 2, B: 3, R: 4, L: 5 };
  return term.replace(
    /\b([UFRBLD])([UFRBLD])([UFRBLD])\b/g,
    (match, a, b, c) => {
      return priorityOrder[b] > priorityOrder[c] ? a + c + b : match;
    }
  );
}

async function handleReadComms(int, client) {
  try {
    await int.deferReply({ flags: 64 });
    const channel = await client.channels.cache.get(process.env.commChannelId);
    let lastMsgId = null;
    let counter = 0;
    while (true) {
      const options = { limit: 100 };
      options.before = lastMsgId;
      // if (lastMsgId) {
      //   options.before = lastMsgId;
      //   if (
      //     (
      //       await readData(`SELECT * FROM comms WHERE message_id=?`, [
      //         lastMsgId,
      //       ])
      //     ).length > 0
      //   ) {
      //     console.log("Up to date");
      //     break;
      //   }
      // }
      let newMsgs = await channel.messages.fetch(options);
      if (newMsgs.size === 0) break;

      for(const msg of newMsgs.values()){
        await saveData(
          `INSERT INTO comms (message_id, content) VALUES (?, ?) ON CONFLICT DO UPDATE SET content=excluded.content`,
          [msg.id, msg.content]
        );
        counter++;
        console.log(counter);
      }
      lastMsgId = newMsgs.last().id;
    }
    await int.editReply("done");
  } catch (error) {
    console.error(error);
  }
}

module.exports = { handleHow, handleReadComms };
