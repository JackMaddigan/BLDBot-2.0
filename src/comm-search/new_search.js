const { EmbedBuilder } = require("@discordjs/builders");
const { readData } = require("../db");

/* Get rid of spaces etc in the search term before processing it */
function cleanSearchTerm(str){ return str.replaceAll(/[\s-]+/g, " ").trim(); }

/* Handle search command from interaction */
async function handleHowInt(int){
  const ephemeral = int.channel.id === process.env.commChannelId;
  const term = cleanSearchTerm(int.options.getString("find"));
  const { embedResponse, textResponse } = await search(term);

  if(embedResponse){
    // reply with embed
    await int.reply({embeds: [embedResponse], flags: ephemeral ? 64 : 0});
  }else {
    // reply with text
    await int.reply(textResponse);
  }
}

/* Handle search command from message */
async function handleHowMsg(msg){
  const term = cleanSearchTerm(msg.content);
  const { embedResponse, textResponse } = await search(term);
  if(embedResponse){
    // reply with embed
    await msg.reply({embeds: [embedResponse]});
  }else {
    // reply with text
    await msg.reply(textResponse);
  }
}

/* Seach for a term, return either an embed or text response to send back to client */
async function search(term){
  // lists of the piece types
  const edgePieces = ["UB","UR","UF","UL","LU","LF","LD","LB","FU","FR","FD","FL","RU","RB","RD","RF","BU","BL","BD","BR","DF","DR","DB","DL"];
  const cornerPieces = ["UBL","UBR","UFR","UFL","LUB","LUF","LDF","LDB","FUL","FUR","FDR","FDL","RUF","RUB","RDB","RDF","BUR","BUL","BDL","BDR","DFL","DFR","DBR","DBL"];
  
  // In a string because it goes in the glob pattern
  const ls = "[UFRBLDufrbld]";

  let commTypes = [
    { 
      // Single Corner Comm
      rx: /^[UFRBLD]{3}\s+[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/, 
      setLastTerms: null,
      glob: `*${correctOrder(term)}*`, 
      filterData: null
    },
    {
      // Single Edge Comm
      rx: /^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{2}\s*$/,
      setLastTerms: null,
      glob: `*${correctOrder(term)}*`, 
      filterData: null 
    },
    {
      // Corners Set
      rx: /^[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/,
      setLastTerms: cornerPieces,
      glob: `*${correctOrder(term)} ${ls}${ls}${ls}[( ]*`, 
      filterData: null 
    },
    {
      // Edges Set
      rx: /^[UFRBLD]{2}\s+[UFRBLD]{2}\s*$/,
      setLastTerms: edgePieces,
      glob: `*${correctOrder(term)} ${ls}${ls}[( ]*`, 
      filterData: null 
    },
    {
      // Single Parity case (needs to be included due to the filter for square brackets)
      rx: /^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/,
      setLastTerms: null,
      glob: `*${correctOrder(term)}*`, 
      filterData: (data) => data.filter((row) => !/[\[\]]/.test(row.content))
    },
    {
      // Parity Set
      rx: /^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{3}\s*$/,
      setLastTerms: cornerPieces,
      glob: `*${correctOrder(term)}*`, 
      filterData: (data) => data.filter((row) => !/[\[\]]/.test(row.content))
    },
    {
      // Single LTCT case (needs to be included due to the glob)
      rx: /^(([UFRBLD]{2}\s+){2})?[UFRBLD]{3}\s+[UFRBLD]{3}\s*\[[UFRBLD]{3}\]\s*$/,
      setLastTerms: null,
      glob: `*${correctOrder(term)}*`, 
      filterData: null
    },
    {
      // LTCT Set
      rx: /^(([UFRBLD]{2}\s+){2})?[UFRBLD]{3}\s+[UFRBLD]{3}\s*\[\s*$/,
      setLastTerms: cornerPieces.filter(sticker => ["U", "D"].includes(sticker[0])),
      glob: `*${correctOrder(term)}*`, 
      filterData: null
    },
    {
      // Default (Search for anything)
      rx: /^.+$/,
      setLastTerms: null,
      glob: `*${term}*`, 
      filterData: null
    }
  ];

  for(const { rx, setLastTerms, glob, filterData } of commTypes){
    if(!rx.test(term)){ continue; }

    // term matches regex, so read from the db
    let data = await readData(`SELECT * FROM comms WHERE content GLOB ? LIMIT 50`, [ glob ]);

    // filter based on this commType's filter function if it is provided, else don't filter further
    if(filterData) { data = filterData(data); }

    // Make either an embed or text response depending on if setLastTerms is provided
    const embedResponse = setLastTerms ? makeSetEmbedResponse(data, setLastTerms, term) : null;
    const textResponse = setLastTerms ? null : makeTextResponse(data);

    return { embedResponse, textResponse };
  }

  // should not happen since the last item in commTypes matches anything with length > 0
  return { embedResponse: null, textResponse: "There was an error processing your request" };
}

function makeSetEmbedResponse(data, set, term){
  // Create a set of ordered notated stickers in alphabetical order, 
  // use it to ensure sticker is nt on one of those pieces hence creating an impossible comm
  let termChunks = new Set(term.split(/\s+/).map((chunk) => chunk.split("").sort().join("")));
  let text = "";
  for(const sticker of set){
    if(checkIfContains(termChunks, sticker)){ continue; }
    const thisComm = `${term} ${sticker}`;
    const links = data
      .filter((item) => item.content.includes(thisComm))
      .map((match) => `[link](${process.env.commChannelLink}${match.message_id})`)
      .join(" ");
    text += `${thisComm} ${links}\n`;
  }
  // just in case it was to go over size limit
  if (text.length > 4096) text = "Too many results!";
  return new EmbedBuilder()
    .setColor(0x7289dd)
    .setTitle(term)
    .setDescription(text);
}

function checkIfContains(chunks, sticker) {
  const orderedSticker = sticker.split("").sort().join("");
  return chunks.has(orderedSticker);
}

function makeTextResponse(data){
  let text = "";
  for (const match of data) {text += `${process.env.commChannelLink}${match.message_id}\n`;}
  if (text.length > 2000) text = "Too many results!";
  else if (text.length === 0) text = `No video for ${term} yet!`;
  return text;
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

module.exports = {
  handleHowInt, handleHowMsg
}