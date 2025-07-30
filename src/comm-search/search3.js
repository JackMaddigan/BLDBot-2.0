const { EmbedBuilder } = require("discord.js");
const { readData } = require("../db");

async function handleHowInt(int) {
  console.log(int.channel.id, process.env.commChannelId);
  await int.deferReply({flags: int.channel.id === process.env.commChannelId ? 64 : 0});
  const payload = await Query.of(int.options.getString("find"));
  await int.editReply(payload);
}

async function handleHowMsg(msg){
  const payload = await Query.of(msg.content);
  await msg.reply(payload);
}

async function handleHowHelpInt(int){
  const embed = new EmbedBuilder()
    .setColor(0x7289dd)
    .setTitle("Video search help")
    .setDescription(
      "Corners case: `UFR UBR RDF`\nCorners set: `UFR RDF`\n"+
      "Edges case: `UF UR UB`\nEdges set: `UF UR`\n"+
      "Wings case: `UFr LUb FLd`\nWings set: `UFr LUb`\n"+
      "X center case: `Ubr Bur Fur`\nX center set: `Ubr Bur`\n"+
      "+ center case: `Ub Fd Ru`\n+ center set: `Ub Fd`\n"+
      "3BLD parity case: `UF UR UFR DBR`\n3BLD parity set: `UF UR UFR`\n"+
      "LTCT case: `UF UR UFR UBR [FUL]`\nLTCT set: `UF UR UFR UBR [`"
    )
  await int.reply({flags: 64, embeds: [embed]});
}

class Query {
  term;
  termTypeInstance;
  // JS map is ordered. Test against the regexes, and create mapped object
  tests = new Map([
    [/^[UFRBLD]{3}\s+[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/, CornerComm],
    [/^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{2}\s*$/, Text],
    [/^[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/, CornerSet],
    [/^[UFRBLD]{2}\s+[UFRBLD]{2}\s*$/, EdgeSet],
    [/^[UFRBLD]{2}[ufrbld]\s+[UFRBLD]{2}[ufrbld]\s*$/, WingSet],
    [/^[UFRBLD][ufrbld]{2}\s+[UFRBLD][ufrbld]{2}$/, XCenterSet],
    [/^[UFRBLD][ufrbld]\s+[UFRBLD][ufrbld]$/, TCenterSet],
    [/^(([UFRBLD]{2}\s+){2})?[UFRBLD]{3}\s+[UFRBLD]{3}\s*\[[UFRBLD]{3}\]\s*$/, LTCTCase],
    [/^(([UFRBLD]{2}\s+){2})?[UFRBLD]{3}\s+[UFRBLD]{3}\s*\[\s*$/, LTCTSet],
    [/^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/, Parity3BLD],
    [/^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{3}\s*$/, Parity3BLDSet],
    [/^.+$/, Text]
  ]);

  constructor(term){
    // remove all hyphens, replace all white spaces with a single space, and trim
    this.term = term.replaceAll(/[\s-]+/g, " ").trim();
    for (const [regex, Type] of this.tests) { 
      if(regex.test(this.term)){ 
        this.termTypeInstance=new Type(this.term); 
        return;
      } 
    }
  }
  static async of(term){
    const query = new Query(term);
    return await query.termTypeInstance.search(); // returns {content: "blah" or like embeds: [embed]}
  }
}

/**
 * Static arrays with stickers
 */
class Stickers {
  static face = "[UFRBLD]";
  static corners = ["UBL","UBR","UFR","UFL","LUB","LUF","LDF","LDB","FUL","FUR","FDR","FDL","RUF","RUB","RDB","RDF","BUR","BUL","BDL","BDR","DFL","DFR","DBR","DBL"];
  static edges = ["UB","UR","UF","UL","LU","LF","LD","LB","FU","FR","FD","FL","RU","RB","RD","RF","BU","BL","BD","BR","DF","DR","DB","DL"];
  static wings = ["UBl", "URb", "UFr", "ULf", "LUb", "LFu", "LDf", "LBd", "FUl", "FRu", "FDr", "FLd", "RUf", "RBu", "RDb", "RFd", "BUr", "BLu", "BDl", "BRd", "DFl", "DRf", "DBr", "DLb"];
  static xCenters = ["Ubl","Ubr","Ufr","Ufl","Lub","Luf","Ldf","Ldb","Ful","Fur","Fdr","Fdl","Ruf","Rub","Rdb","Rdf","Bur","Bul","Bdl","Bdr","Dfl","Dfr","Dbr","Dbl"];
  static tCenters = ["Ub","Ur","Uf","Ul","Lu","Lf","Ld","Lb","Fu","Fr","Fd","Fl","Ru","Rb","Rd","Rf","Bu","Bl","Bd","Br","Df","Dr","Db","Dl"];
  static orderCorner(sticker){
    const priorityOrder = { U: 0, D: 1, F: 2, B: 3, R: 4, L: 5 };
    return sticker.replace(/\b([UFRBLD])([UFRBLD])([UFRBLD])\b/g, (match, a, b, c) => {
      return priorityOrder[b] > priorityOrder[c] ? a + c + b : match;
    });
  }
  static removeSamePiece(termStickers, pieceTypeStickers){
    // Make array of stickers that will be in the set (AKA not on the search term stickers)
    const sortedTermStickers = termStickers.map(term => term.split("").sort().join(""));
    return pieceTypeStickers.filter(sticker => !sortedTermStickers.includes(sticker.split("").sort().join("")));
  }
}

class QueryTerm {
  glob;
  async fetch(glob){return await readData(`SELECT * FROM comms WHERE content GLOB ?`, [ glob ]);}
  // search method for a general term just to send links back
  async search(){
    const data = await this.fetch(this.glob);
    let content = data
      .map((match) => `${process.env.commChannelLink}${match.message_id}`)
      .join("\n") || "No results!";
    if(content.length > 2000){content=`Too many results to display! (${data.length} matches)`;}
    return {content};
  }
}

class CubeSet extends QueryTerm {
  termStickers;
  setStickers;
  title;
  constructor(termStickers, setStickers){
    super();
    this.termStickers = termStickers;
    this.setStickers = setStickers;
  }

  // Override the search method from QueryTerm to create a set embed
  async search(){
    const data = await this.fetch(this.glob);
    let text = "";
    const set = this.termStickers.join(" ");
    for(const sticker of this.setStickers){
      const thisComm = `${set} ${sticker}`;
      const links = data
        .filter((item) => item.content.includes(thisComm))
        .map((match) => `[link](${process.env.commChannelLink}${match.message_id})`)
        .join(" ");
      text += `${set} ${sticker} ${links}\n`;
    }
    return this.embed(this.title, text);
  }

  // create an embed from a title and text
  embed(title, text){
    if (text.length > 4096) text = "Too many results!";
    return {
      embeds: [
      new EmbedBuilder()
        .setColor(0x7289dd)
        .setTitle(title)
        .setDescription(text)
      ]};
  }
}

class CornerSet extends CubeSet {
  constructor(term){
    const definingSetStickers = term.split(/\s+/g).map(Stickers.orderCorner);
    super(definingSetStickers, Stickers.removeSamePiece(definingSetStickers, Stickers.corners));
    this.title = definingSetStickers.join(" ");
    this.glob = `*${this.termStickers.join(" ")} ${Stickers.face}${Stickers.face}${Stickers.face}[( ]*`;
  }
}

class EdgeSet extends CubeSet {
  constructor(term){
    const definingSetStickers = term.split(/\s+/g);
    super(definingSetStickers, Stickers.removeSamePiece(definingSetStickers, Stickers.edges));
    this.title = definingSetStickers.join(" ");
    this.glob = `*${this.termStickers.join(" ")} ${Stickers.face}${Stickers.face}[( ]*`;
  }
}

class Parity3BLDSet extends CubeSet {
  constructor(term){
    const definingSetStickers = term.split(/\s+/g);
    super(definingSetStickers, Stickers.removeSamePiece(definingSetStickers, Stickers.corners));
    this.title = definingSetStickers.join(" ");
    this.glob = `*${this.termStickers.join(" ")} ${Stickers.face}${Stickers.face}${Stickers.face}[( ]*`;
  }
}

class WingSet extends CubeSet {
  constructor(term){
    const definingSetStickers = term.split(/\s+/g);
    super(definingSetStickers, Stickers.wings.filter(sticker => !definingSetStickers.includes(sticker)));
    this.title = definingSetStickers.join(" ");
    this.glob = `*${this.termStickers.join(" ")} ${Stickers.face}${Stickers.face}${Stickers.face.toLowerCase()}[( ]*`;
  }
}

class XCenterSet extends CubeSet {
  constructor(term){
    const definingSetStickers = term.split(/\s+/g);
    super(definingSetStickers, Stickers.xCenters.filter(sticker => !definingSetStickers.includes(sticker)));
    this.title = definingSetStickers.join(" ");
    this.glob = `*${this.termStickers.join(" ")} ${Stickers.face}${Stickers.face.toLowerCase()}${Stickers.face.toLowerCase()}[( ]*`;
  }
}

class TCenterSet extends CubeSet {
  constructor(term){
    const definingSetStickers = term.split(/\s+/g);
    super(definingSetStickers, Stickers.tCenters.filter(sticker => !definingSetStickers.includes(sticker)));
    this.title = definingSetStickers.join(" ");
    this.glob = `*${this.termStickers.join(" ")} ${Stickers.face}${Stickers.face.toLowerCase()}[( ]*`;
  }
}

class LTCTSet extends CubeSet {
  constructor(term){
    const [corner2, corner1] = term.replace(/\[/g, "").trim().split(/[\s]+/g).reverse();
    const definingSetStickers = [corner1, corner2];
    super(definingSetStickers, Stickers.removeSamePiece(definingSetStickers, Stickers.corners).filter(s => !(s.startsWith("U") || s.startsWith("D"))));
    this.title = definingSetStickers.join(" ") + " [___]";
    this.glob = `*${this.termStickers.join(" ")}?[[]${Stickers.face}${Stickers.face}${Stickers.face}[]]*`;
  }
  // override search again just for ltct set since it is annoying
  async search(){
    const data = await this.fetch(this.glob);
    let text = "";
    const set = this.termStickers.join(" ");
    for(const sticker of this.setStickers){
      const links = data
        .filter((item) => new RegExp(`${set}\\s*\\[${sticker}`).test(item.content))
        .map((match) => `[link](${process.env.commChannelLink}${match.message_id})`)
        .join(" ");
      text += `${set} [${sticker}] ${links}\n`;
    }
    return this.embed(this.title, text);
  }
}

class CornerComm extends QueryTerm {
  constructor(term){
    super();
    this.glob = `*${term.split(/\s+/g).map(Stickers.orderCorner).join(" ")}*`;
  }
}

class Parity3BLD extends QueryTerm {
  constructor(term){
    super();
    const [edge1, edge2, corner1, corner2] = term.split(/\s+/);
    this.glob = `*${edge1} ${edge2} ${Stickers.orderCorner(corner1)} ${Stickers.orderCorner(corner2)}*`;
  }
}

class LTCTCase extends QueryTerm {
  constructor(term){
    super();
    const [twist, secondCorner, firstCorner] = term.split(/\s+/g).reverse();
    this.glob = `${Stickers.orderCorner(firstCorner)} ${Stickers.orderCorner(secondCorner)}?[[]${Stickers.orderCorner(twist)}[]]`;
  }
}

class Text extends QueryTerm {
  constructor(term){
    super();
    this.glob = `*${term}*`;
  }
}

module.exports = {
  handleHowInt, handleHowMsg, handleHowHelpInt
}