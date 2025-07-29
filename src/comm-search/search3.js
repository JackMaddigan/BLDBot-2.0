async function handleHow(int) {
  // use Query.of(int.options.getString("find"));
}

class Query {
  term;
  termType;
  // JS map is ordered. Test against the regexes, and create mapped object
  tests = new Map([
    [/^[UFRBLD]{3}\s+[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/, CornerComm],
    [/^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{2}\s*$/, EdgeComm],
    [/^[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/, CornerSet],
    [/^[UFRBLD]{2}\s+[UFRBLD]{2}\s*$/, EdgeSet],
    [/^[UFRBLD]{2}[ufrbld]\s+[UFRBLD]{2}[ufrbld]\s*$/, WingSet],
    [/^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{3}\s+[UFRBLD]{3}\s*$/, Parity3BLD],
    [/^[UFRBLD]{2}\s+[UFRBLD]{2}\s+[UFRBLD]{3}\s*$/, Parity3BLDSet],
    [/^(([UFRBLD]{2}\s+){2})?[UFRBLD]{3}\s+[UFRBLD]{3}\s*\[[UFRBLD]{3}\]\s*$/, LTCTCase],
    [/^(([UFRBLD]{2}\s+){2})?[UFRBLD]{3}\s+[UFRBLD]{3}\s*\[\s*$/, LTCTSet],
    [/^.+$/, Text]
  ]);
  constructor(term){
    // remove all hyphens, replace all white spaces with a single space, and trim
    this.term = term.replaceAll(/[\s-]+/g, " ").trim();
    for (const [regex, Type] of this.tests) { if(regex.test(this.term)){ return this.termType=new Type(this.term); } }
  }
  static async of(term){
    const query = new Query(term);
    // run the async methods in the query termType
    return await query.termType.search(); // returns {content: "blah" or like embeds: [embed]}
  }
}

/**
 * Static methods used to correct the order of search terms, depending on the type of piece
 */
class CorrectOrder {
  static Corners_Edges(sticker){
    const priorityOrder = { U: 0, D: 1, F: 2, B: 3, R: 4, L: 5 };
    return sticker.replace(/\b([UFRBLD])([UFRBLD])([UFRBLD])\b/g, (match, a, b, c) => {
        return priorityOrder[b] > priorityOrder[c] ? a + c + b : match;
    });
  }
}

/**
 * Static arrays with stickers
 */
class Stickers {
  static face = "[UFRBLD]";
  static corners = ["UBL","UBR","UFR","UFL","LUB","LUF","LDF","LDB","FUL","FUR","FDR","FDL","RUF","RUB","RDB","RDF","BUR","BUL","BDL","BDR","DFL","DFR","DBR","DBL"];
}

class QueryTerm {
  glob;
  static async fetch(glob){
    return await readData(`SELECT * FROM comms WHERE content GLOB ? LIMIT 50`, [ glob ]);
  }
  async search(){ throw new Error("Async Search method not implemented for this termType!"); }
}

// TODO
class CubeSet {
  static embedOf(data){
    return null;
  }
}

class QueryCubeTerm extends QueryTerm {
  termStickers;
  setStickers;
  constructor(termStickers, pieceTypeStickers){
    super();
    this.termStickers = termStickers;
    // Make array of stickers that will be in the set (AKA not on the search term stickers)
    const sortedTermStickers = this.termStickers.map(term => term.split("").sort().join(""));
    this.setStickers = pieceTypeStickers.filter(sticker => sortedTermStickers.includes(sticker));
  }
}

class CornerSet extends QueryCubeTerm {
  constructor(term){
    super(term.split(/\s+/g).map(CorrectOrder.Corners_Edges), Stickers.corners);
    this.glob = `*${this.termStickers.join(" ")} ${Stickers.face}${Stickers.face}${Stickers.face}[( ]*`;
  }
  async search(){
    const data = QueryTerm.fetch(this.glob);
    return Set.embedOf(data);
  }
}


class CornerComm {}
class EdgeComm {}
class Parity3BLD {}
class Parity3BLDSet {}
class LTCTCase {}
class LTCTSet {}
class Text {}
class WingSet {}


/*
sets
comms
parity
flips
ltct
other
*/