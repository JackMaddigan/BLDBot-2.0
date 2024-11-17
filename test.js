const { saveData } = require("./src/db");

const data = [
  {
    id: "1256199483142963251",
    content:
      "UF UB UL and UF UL UB(L2 U:L2,S' and L2 U:S',L2(\nYou can invert the first U move to get the other 4 mover direction of you prefer",
  },
  {
    id: "1255369812482326528",
    content:
      "UF BR DF and UF DF BR(U R':U/M' and U R':U'/M')\nD' U and R are also great options",
  },
  {
    id: "1253329850148851773",
    content: "UF FD RB and UF RB FD(M':U R' U',M' and M':M',U R' U')",
  },
  {
    id: "1253329211947618354",
    content: "UF FR LD and UF LD FR( D:M',U' R U and D:U' R U,M'",
  },
  {
    id: "1252818073153437697",
    content:
      "UF UB RU and UF RU UB(S U':S,R2 and S U':R2,S) you can also invert the U' to invert the 4  mover direction of you prefer",
  },
  {
    id: "1249653251410759821",
    content: "UFR UFL LUB and\nUFR LUB UFL(U' R:R D R',U2 and U' R;U2,R D R')",
  },
  {
    id: "1247393902067974225",
    content:
      "UFR RUB BDR and UFR BDR RUB(D U R:R D' R',U2  and D U R:U2,R D' R')",
  },
  {
    id: "1246641726035202139",
    content:
      "UFr RUf RDb and UFr RDb RUf\n(U' Rw': u, R U' R' and U' Rw': R U' R', u)",
  },
  {
    id: "1246635866881916938",
    content:
      "UFr DBr DLb and UFr DLb DBr\n(R' B R: R F R', b and R' B R: b, R F R')\n\nD': r2, U' R2 U and D' Rw: r, U R' U' are also good",
  },
  {
    id: "1240154756249419807",
    content: "UF RU UFR RDB\n(R’ F R D R’ F2 R D’ R’ F R2 D R2’ F R2 D’ R’)",
  },
  {
    id: "1240154344863826040",
    content: "UF RU UFR BDL \n(x’ UD R U’ R2’ U R U2 R D R’ U R D2)",
  },
  {
    id: "1240153877664501791",
    content: "UF RU UFR UFL\n(S’ U’ R U R’ F’ R U R’ U’ R’ F R2 U’ R’ S)",
  },
  {
    id: "1238639607826874449",
    content:
      "UFR LUF LDB and UFR LDB LDF (U' R' U, L2 and L2, U' R' U) \nU ' R and R' U' R setups are also quite good",
  },
  {
    id: "1237961676528029798",
    content: "UF RU UFR UBL\n(S U R U’ R2’ F R f’ R U’ B U2 B’ R’)",
  },
  {
    id: "1237647437561073674",
    content:
      "UR LB LD and UR LD LB\n(E' R E,l  and L, E' R E)\n\nLike the mirror, this can  also  be done with right thumb down",
  },
  {
    id: "1237647106307653663",
    content:
      "UR LF LD and UR LD LF\n(E R' E', l' and l', E R' E')\n\nThis case can also be done with right thumb up",
  },
  {
    id: "1234032130053636107",
    content:
      "UFR LUF DFR and UFR DFR LUF\n(R U’ R’: R’ D’ R, U2  and R U’ R’: U2, R’ D’ R) \nanother option is \nD’U’ R’ U: R U’ R’, D and D’U’ R’ U: D, R U’ R’)",
  },
  {
    id: "1234026980660347014",
    content:
      "UFR LUF RDF and UFR RDF LUF \n(R’ U’: D’, R U R’ and R’ U’: R U R’ D’)",
  },
  {
    id: "1230956594917937234",
    content:
      "Sorry for the spring noise I haven't set up the cube yet <:bldsob:1093704653641879653>",
  },
  {
    id: "1230956552324907108",
    content:
      "UF UR UFR UBL   r2' D' r2 U' r2' D r2 D' r2' D r2 U' r2' U r2\nI recommend keeping your thumb as much on the right as you can so it doesn't catch during U/D layer turns",
  },
  {
    id: "1230815501949603902",
    content:
      "UF FD DR and UF DR FD(U' R2 U, M' and M', U' R2 U) \nOther safer options exist like U R' F and U' S' but I personally find this more consistent due to pseudo 2 gen",
  },
  {
    id: "1230236978314739723",
    content:
      "UFR LUF BUL [R B' R', F] alternatively you can reload index, alternatively [x': [R U' R', D]]\n\nUFR BUL LUF [F, R B' R'] index B at the end is actually slightly better than middle finger B show in the vid, alternatively [x': [D, R U' R']]\n\nKeeping left pinky on S slice helps a lot for these",
  },
  {
    id: "1216284006396727427",
    content: "UF UL UFR RDF(R U' R' U2 R U2 R' F R U R' U' R' F' R)",
  },
  {
    id: "1216281877623734282",
    content:
      "UF LB RD and UF RD LB(S':R E' R',U' and S':U',R E' R') R' F and M' U are also good",
  },
  { id: "1214900285114286200", content: "" },
  {
    id: "1214900139404034068",
    content: "UFR UFL DBL and UFR DBL UFL(R' B:R U' R',D' and R' B:D',R U' R')",
  },
  {
    id: "1214898936574246933",
    content: "UF RB BD and UF BD RD(D':R ,D' M D and D2:M, D R D')",
  },
  {
    id: "1214897262296039494",
    content: "UF RU BR and UF BR RU(R' U2:R S R',U' and R' U:R S R',U)",
  },
  { id: "1214896917683900446", content: "UF FR RU(R U R':S,R U R')" },
  {
    id: "1213970803197091900",
    content:
      "UF DR LU and UF LU DR (r: L E' L', U' and r: U', L E' L')\nThis can also be done as LFS regripless",
  },
  {
    id: "1213970624586981478",
    content: "UF DR LF and UF LF DR (U'E': R'/E' and U'E': R/E')\nR' F is ok",
  },
  {
    id: "1213970486917210123",
    content:
      "UF DF RU and UF RU DF (D: S', R' F R and D: R' F R, S')\nR F is good too",
  },
  {
    id: "1213970367685730415",
    content:
      "UF DF LF and UF LF DF (L2 F': E', L2 and L2 F': L2, E')\nU R' F' is good too",
  },
  {
    id: "1213970184965202001",
    content: "UF DF LD and UF LD DF (L F': E', L2 and L F': L2, E')",
  },
  {
    id: "1213970083592806491",
    content: "UF DF FL and UF FL DF (U'D: R/E and U'D: R'/E)",
  },
  {
    id: "1213969980153012244",
    content: "UF DF DR and UF DR DF (R': F/R S' R' and R': F'/R S' R')",
  },
  {
    id: "1213969854823137280",
    content: "UF DF BR and UF BR DF (UD': L/E and UD': L'/E)",
  },
  {
    id: "1213969767766032404",
    content: "UF DB FL and UF FL DB (U L' U', M2 and M2, U L' U')",
  },
  {
    id: "1213969686945996851",
    content: "UF DB FD and UF FD DB (D: S' R F R' and D': R F R', S')",
  },
  {
    id: "1213635731373821993",
    content:
      "UF DB DL and UF DL DB (D L: F/L' S L and D L: F'/L' S L)\nU' D R D R' D' R' D' R' D R U and inverse are good too",
  },
  {
    id: "1213635439504654347",
    content:
      "UF BL DL and UF DL BL (U' L' U' L' U L U L U L' and L U' L' U' L' U' L U L U)",
  },
  {
    id: "1213635318402515046",
    content: "UF BU UL and UF UL BU (L U L' U', M and M, L U L' U')",
  },
  {
    id: "1213635228787146812",
    content: "UF BU LB and UF LB BU (M', U' L U and U' L U, M')",
  },
  {
    id: "1213635133580640327",
    content: "UF BU FL and UF FL BU (U L' U', M and M, U L' U')",
  },
  {
    id: "1213635032686665728",
    content: "UF BR RU and UF RU BR (R u': R'/E' and R u': R/E')",
  },
  {
    id: "1213634929196408852",
    content: "UF BR RF and UF RF BR (R' U' R, E and E, R' U' R)",
  },
  {
    id: "1213634851048136704",
    content: "UF BR LB and UF LB BR (R' U' R, E' and E', R' U' R)",
  },
  {
    id: "1213634742046564422",
    content: "UF BR DL and UF DL BR (U: L'/E and U: L/E)",
  },
  {
    id: "1213634665852968960",
    content: "UF UL BL and UF BL UL (E': U, L' E L and E': L' E L, U)",
  },
  {
    id: "1213631400708931645",
    content: "UF UB BL and UF BL UB (L' U: S', L2 and L' U': S', L2)",
  },
  {
    id: "1213631301131964427",
    content: "UF BL LD and UF LD BL (S' U': R/E' and S' U': R'/E')",
  },
  {
    id: "1213631212942528553",
    content: "UF BL BR and UF BR BL (R U': R/E' and R U': R'/E')",
  },
  {
    id: "1213631137986117752",
    content: "UF BD LU and UF LU BD (U'D': R' F R, S' and U'D': S', R' F R)",
  },
  {
    id: "1213631040380207114",
    content: "UF BD LF and UF LF BD (U' M: R' E R, U and U' M: U, R' E R)",
  },
  {
    id: "1213630918158192641",
    content:
      "UF BD LD and UF LD BD (U: S, r' U' r and U: r' U' r, S)\nU: R' D R, S' is good too",
  },
  {
    id: "1213630762134274149",
    content: "UF BD DR and UF DR BD (D' R' F': E, R2 and D' R' F': R2, E)",
  },
  {
    id: "1213630639383908392",
    content: "UF BD DL and UF DL BD (D L F: E', L2 and D L F: L2, E')",
  },
  {
    id: "1213630544575725608",
    content: "UF BD DF and UF DF BD (D': R F R', S' and D': S', R F R')",
  },
  {
    id: "1213630407153819648",
    content: "UF BL BD and UF BD BL (U2: M, U' L U and U: L, U M U')",
  },
  {
    id: "1213629958287527996",
    content: "UFR FDL RUB and UFR RUB FDL(R D2 R:R' D R,U and R D2 R:U,R' D R)",
  },
  {
    id: "1213306355050610749",
    content: "UF BL DF and UF DF BL(U' D:R/E' and U' D:R'/E')",
  },
  {
    id: "1213305370404069376",
    content: "UF UB FR and UF FR UB(U'/L' E2 L and U/L' E2 L)",
  },
  {
    id: "1212177688958079028",
    content:
      "UF FR DF and UF DF FR(R' f2 R2 U' R2' f2 R2 U' R' and R U R2' f2 R2 U R2 f2 R",
  },
  {
    id: "1211419714979635260",
    content:
      "UF DR DL & UF DL DR (D/M & D'/M)\n\nThere are other good 4 mover options like U: L2, S and U': R2, S' if you prefer not to do the M and M' with your index finger",
  },
  {
    id: "1211389804714000565",
    content: "Ubr Ruf Dfr & Ubr Dfr Ruf (u: r2, U' l' U & u: U' l' U, r2)",
  },
  {
    id: "1211388729948766319",
    content: "Ubr Ldf Dfr & Ubr Dfr Ldf (d': r2, U' l U & d': U' l U, r2)",
  },
  {
    id: "1211387351377518662",
    content:
      "Ubr Bur Fdr & Ubr Fdr Bur (Uw' r: r u r', U2 & Uw' r: U2, r u r')",
  },
  {
    id: "1211385865645858848",
    content:
      "Ubr Bdr Rdb & Ubr Rdb Bdr (S': r', Uw' l' Uw & S': Uw' l' Uw, r')",
  },
  {
    id: "1211384379608277072",
    content:
      "Ubr Lub Fdl & Ubr Fdl Lub (Uw: Uw l' Uw', r' & Uw: r', Uw l' Uw')",
  },
  {
    id: "1211382996725399684",
    content: "Ubr Ldb Dfl & Ubr Dfl Ldb (d': U' l2 U, r' & d': r', U' l2 U)",
  },
  {
    id: "1211381388402495529",
    content: "Ubr Ldb Rdb & Ubr Rdb Ldb (L': d'/l U' l' & L': d/l U' l')",
  },
  {
    id: "1211379290696843314",
    content: "Ubr Ldf Rdf & Ubr Rdf Ldf (R': d'/l U' l' & R': d/l U' l')",
  },
  {
    id: "1211377678821630032",
    content: "Ubr Lub Dfr & Ubr Dfr Lub (r2, Uw' l' Uw & Uw' l' Uw, r2)",
  },
  {
    id: "1211375837887209533",
    content: "Ubr Fur Dbr & Ubr Dbr Fur (Uw: r2, Uw l Uw' & Uw: Uw l Uw', r2)",
  },
  {
    id: "1211373618605457479",
    content: "Ubr Ful Dfr & Ubr Dfr Ful (r2, U' l' U & U' l' U, r2)",
  },
  {
    id: "1211371865126215740",
    content: "Ubr Fdr Dbl & Ubr Dbl Fdr (U: U l2 U', r & U: r, U l2 U')",
  },
  {
    id: "1211370227212750868",
    content: "Ubr Fur Dfl & Ubr Dfl Fur (U' l2 U, r & r, U' l2 U)",
  },
  {
    id: "1210027348775407626",
    content: "Ubr Bur Dbl & Ubr Dbl Bur (U: U l2 U', r' & U: r', U l2 U')",
  },
  {
    id: "1210024453980037220",
    content: "Ubr Bul Dbr & Ubr Dbr Bul (U: r2, U l U' & U: U l U', r2)",
  },
  {
    id: "1210020465267970128",
    content: "Ubr Bdr Dfl & Ubr Dfl Bdr (U' l2 U, r' & r', U' l2 U)",
  },
  {
    id: "1210018545094754415",
    content: "UF BR DB & UF DB BR (M2, U' R' U & U' R' U, M2)",
  },
  {
    id: "1209305809750851624",
    content: "Ubr Bdl Dfr & Ubr Dfr Bdl (r2, U' l U & U' l U, r2)",
  },
  {
    id: "1209123478410891295",
    content:
      "UFR LDF DFR and UFR DFR LDF(U D R D':U',R' D R and U D R D':R' D R' U') U' R' D R is also good",
  },
  {
    id: "1208771785387155466",
    content: "UF BR F\nRD and UF RD BR(S U:L'/E and S U:L/E) D' is also good",
  },
  {
    id: "1208771037676830760",
    content: "UF BR RD and UF RD BR(D':M',U' R' U and D':U' R' U,M')",
  },
  {
    id: "1208019505368928256",
    content: "UFR FDL BUL and UFR BUL FDL(D R':D,R' U R and D R':R' U R,D)",
  },
  {
    id: "1207892121160253471",
    content:
      "UFR FDR LUB and UFR LUB FDR \n( R U R’: U’, R’ D’ R and R U R’: R’ D’ R, U)",
  },
  {
    id: "1205435253045461033",
    content:
      "UFR BDR BDL and UFR BDL BDR (D R' D:F,D' R D R' And D2 R':F,R D' R' D)",
  },
  { id: "1205433946926743593", content: "UF UL UB (L2':U/S)" },
  {
    id: "1205322876048379924",
    content: "UB BR DF and UB DF BR (M2,U R' U' and U R' U',M2)",
  },
  {
    id: "1205164438731096084",
    content: "UF LB DB and UF DB LB(M/U' L U and M'/U' L U)",
  },
  {
    id: "1205162683414876261",
    content: "UF FD RB and UF RB FD(M':U R' U', M' and M2:U R' U',M)",
  },
  {
    id: "1203704476536545291",
    content:
      "UF FL DL and UF DL FL\n(U' L U L U' L' U' L' U' L U2\n and U2 L' U L U L U L' U' L' U)",
  },
  {
    id: "1203520476916359229",
    content:
      "UF UR UL and UF UL UR \n(M2:U/M and M2:U'/M) \nYou can also mirror the fingertrick with righty M moves if you prefer",
  },
  {
    id: "1202933358070333460",
    content:
      "UF LU UB and UF UB LU\n(U' M:U'/M' and U' M:U/M') \nS' and L' are also good",
  },
  {
    id: "1202931849253359687",
    content: "UF BU RB and UF RB BU\n(M',U R' U' and U R' U', M')",
  },
  {
    id: "1202930634478059541",
    content:
      "UFR LDF FUL and UFR FUL LDF\n(D R':F2,R D' R' D and R' D:F2,D' R D R'",
  },
  {
    id: "1201397878514516088",
    content: "UF UR UFR UBL [BUR]\n(R2' D' R U R' D R U R U' R' U' R U'",
  },
  {
    id: "1200656057429667963",
    content: "UB UR DF and UB DF UR (R U R' U', M2 and M2, R U R' U'",
  },
  {
    id: "1200402558586470451",
    content:
      "UF LU BR and UF BR LU (S' U:L'/E and S' U:L/E) LUM is also a good option",
  },
  {
    id: "1200402087222190130",
    content:
      "UF LU BR and UF BR LU (M': U', L' E L and M': L' E L, U') S' U is also a good option",
  },
  {
    id: "1200399918045614132",
    content: "[UB, DF] [DF, UB] flip\nU: R', F' R S, + U2, M'",
  },
  {
    id: "1200398768479162489",
    content:
      "UFR LDF BUL and UFR BUL LDF (R B' R': R' D R, U, and R B' R':U, R' D R) \nThe first B' can also be done as a left hand drag",
  },
  {
    id: "1200397090497503313",
    content: "UF UR UFR RDF (U2 R' F R2 U' R' U' R U R' F' R U R' U)",
  },
  {
    id: "1200394453064626186",
    content: "UF UB DR and UF DR UB (U':S, R2 and U': R2, S)",
  },
  {
    id: "1200391196133036142",
    content: "UF FR BD and UF BD FR (U2:M, U R U' and U': R, U' M U)",
  },
  {
    id: "1200388654577754133",
    content: "UF FL BD and UF BD FL(U' R' B:E, R2 and U' R' B:R2, E",
  },
  {
    id: "1199669248608448512",
    content:
      "UFR UBL FUL and UFR FUL UBL (l' D':U/ R D R' and l' D': U'/R D R') l' to pure us also good",
  },
  {
    id: "1199666419936268361",
    content:
      "UF BD RU and UF RU BD (D U: L F' L', S and D' U: S, L F' L') MU alg is also good",
  },
  {
    id: "1199662544755892298",
    content:
      "UF BU DR and UF DR BU (U' R2' U', M and M, U R2 U') \nD' U is also a good option",
  },
  {
    id: "1199661244035121222",
    content: "UF UR UFR FUL (L U' F2 l' R' F R F' R U2 r' U L U L'",
  },
  {
    id: "1199659364936585227",
    content: "UF RU BL and UF BL RU (S U':R/ E', and S U':R'/E'",
  },
  {
    id: "1198875900733825084",
    content: "UF LF DB and UF DB LF(M/U' L' U and M'/U' L' U)",
  },
  {
    id: "1198873831876599859",
    content: "UF RU RD and UF RD RU (r U' R':R2', S) and (r U' R':S, R2)",
  },
  {
    id: "1194645296660107335",
    content: "UF BD BR & UF BR BD (U2: U R' U', M & U2: M, U R' U')",
  },
  {
    id: "1191986070661902398",
    content: "UF LD LF & UF LF LD (U S' U', L & L, U S' U')",
  },
  {
    id: "1191976339566231592",
    content: "UF RF LB & UF LB RF (l' U': L/E' & l' U': L'/E')",
  },
  {
    id: "1191974611097755768",
    content: "UF LF RB & UF RB LF (r U: R'/E & r U: R/E)",
  },
  { id: "1189540881292861510", content: "" },
  {
    id: "1189540760115236884",
    content:
      "UBR LUB RDF and UBR RDF LUB (U R' U:R U' R' ,D') and (U R' U: D', R U' R')",
  },
  {
    id: "1187843718498230292",
    content: "UFR RDF FDL and UFR FDL RDF (R U R', D and D, R U R')",
  },
  {
    id: "1187843606271238174",
    content: "UFR RDF FUL and UFR FUL RDF (D R: U'/R' D' R and D R: U/R' D' R)",
  },
  {
    id: "1187841935554134066",
    content: "UFR RDF DBL and UFR DBL RDF (R: R D' R', U' and R: U', R D' R')",
  },
  {
    id: "1181626134736142357",
    content:
      "UF/FU RD/DR Twist: [U: [R' E' R, U2] [U: [S, R2] (canceled setup move for 2nd comm)",
  },
  {
    id: "1180753800475201627",
    content:
      "UF UR UFR UBL (f U R U R2' U'D' R U R' D R2 U2' f')\nAs shown in the vid, last move can also be done as B'.\nThe domino alg is probably faster if you can spam it really well, but ime most people can't and this is probably a better/more consistent option. \nY perm is good if you're happy to swap UB/UL instead also",
  },
  {
    id: "1179937464538902568",
    content:
      "UFR FUL BDL & UFR BDL FUL (D2 R': R D' R' D, F2 & D2 R': F2, R D' R' D)\nD2 with pinky ring also works but I personally use ring pinky",
  },
  {
    id: "1178552581732179978",
    content:
      "do not worry about D D overwork https://discord.com/channels/1005598437401698365/1005604250539270145/1152039256752140298",
  },
  {
    id: "1178552424810680330",
    content: "UFR UFL BDR & UFR BDR UFL (D': R' D' R, U' & D': U', R' D' R)",
  },
  { id: "1178273189281943572", content: "M U alg is also a good option" },
  { id: "1178272982477582356", content: "" },
  {
    id: "1178272976936902656",
    content: "UF FU UB BU ([U' (S, R' F R)[U2, M']",
  },
  { id: "1178271873751076905", content: "" },
  {
    id: "1178271872618594344",
    content: "UF UR UFR UBR (R U R' F' R U R' U' R' F R2 U' R' U'",
  },
  {
    id: "1178158646027366410",
    content: "UF UR UFR DFR (DU R2' U' R2 U R2' D' R2 U R2' U' R2 U2)",
  },
  {
    id: "1178158558773264504",
    content: "UF UR UFR DBR (U R2' U' R2 U R2' D' R2 U R2' U' R2 U2D)",
  },
  {
    id: "1178157412629352468",
    content: "UF UR UFR DBL (DU' r2' D' r2 U r2' U' r2 U r2' D' r2)",
  },
  {
    id: "1178157266734690354",
    content: "UF UR UFR DFL (U' r2' D' r2 U r2' U' r2 U r2' D' r2 D)",
  },
  {
    id: "1178153294141595729",
    content: "UFR LUB LDF & UFR LDF LUB (U R': U', R' D R & U R': R' D R, U')",
  },
  {
    id: "1177498084377382993",
    content:
      "UFR UFL DBL & UFR DBL UFL (R' D' R: R U' R', D & R' D' R: D, R U' R')",
  },
  {
    id: "1177158721672052746",
    content:
      "UFR LUF LDF & UFR LDF LUF (R' U' : D, R U R' & R' U' : R U R', D)\nCan also do lefty push for the last U'",
  },
  {
    id: "1176002510608142466",
    content: "UF UR BR & UF BR UR (E: U', R E' R' & E: R E' R', U')",
  },
  {
    id: "1173924044102434838",
    content:
      "UF LU DB & UF DB LU (D: L F' L', S & D: S, L F' L')\nLUM is great too",
  },
  {
    id: "1173923809846362153",
    content:
      "UF LU DB & UF DB LU (L': M/U' L U & L': M'/U' L U)\nD to LFS is great too",
  },
  {
    id: "1173844368470327296",
    content:
      "UF UR UFR UFL [RUB] (R2' U' R U R U' R UD' R U' R' UD)\nU R U2' R' U2 R' U' F R f' R' U R S is another great option",
  },
  {
    id: "1173823728799449188",
    content:
      "UFR LUB RDF & UFR RDF LUB (U R' U': U', R D R' & U R' U': R D R', U')\nD' R U: R' D R, U is another good option if your thumb is on bottom of the cube. \nYou can also use D R U: R' D' R, U if it cancels stuff",
  },
  {
    id: "1173820039795851336",
    content: "UFR UBL BDR & UFR BDR UBL (D: U'/R D' R' & D: U/R D' R')",
  },
  {
    id: "1173818626088910958",
    content:
      "UFR UBL DBR & UFR DBR UBL (R D' R': R' D R, U2 & R D' R': U2, R D' R)",
  },
  {
    id: "1173354970888810558",
    content:
      "UFR BUR BDR & UFR BDR BUR (R U': R' U R, D & R U': D, R' U R)\nYou can also right index pinch for the last U",
  },
  {
    id: "1173029851985354802",
    content:
      "UF LD RU & UF RU LD (L F': L/S' & L F': L'/S')\nU is another great option here",
  },
  {
    id: "1173029508681580555",
    content:
      "UF LD RD & UF RD LD (R' F: R'/S' & R' F: R/S')\nMirroring for the second direction is another good option here",
  },
  {
    id: "1173024931559252039",
    content:
      "UF DF RB & UF RB DF (r U': R2', S & r U: R2', S)\nThere are other good options for these, such as F, F', or the inverses of the algs I show. I find this to be the best option from home grip though",
  },
  {
    id: "1173021330350817372",
    content:
      "UF FL RU & UF RU FL (S U': R'/E & S U': R/E)\nR': E, r U r' & inverse is good too",
  },
  {
    id: "1173020372526956645",
    content: "UF UL BD & UF BD UL ((U' M U' M')2 & (M U M' U)2)",
  },
  {
    id: "1173019182158331936",
    content: "UF LD DB & UF DB LD (U: S', L B' L' & U: L B' L', S')",
  },
  {
    id: "1173017298521555135",
    content: "UFR BUR DBL & UFR DBL BUR (R U': R' U R, D' & R U': D', R' U R)",
  },
  {
    id: "1172644586196320351",
    content:
      "UFr BUr Wing Parity (l' U2 l' U2 M' U2 l' U2 l U2 r' U2 l2 & l' U2 l' U2 M' U2 l' U2 lm U2 r' U2 l2) \nthe way i execute it is by slicing every r/l/M except the last and doing those as R Rw' and Rw2 3Rw2/3Rw2 4Rw2 and also right hand double flick every U2",
  },
  {
    id: "1172106089207169055",
    content:
      "UFR DFL DBL & UFR DBL DFL (F2, r D r' & r D r', F2)\nR U'D' is another excellent option, and may be faster for many people. From what I've seen though, people often find the pure comm easier and more consistent",
  },
  {
    id: "1172105277345107968",
    content:
      "UFR UBL DFL & UFR DFL UBL (R F' R': U'/R D R' & R F' R': U/R D R')",
  },
  {
    id: "1172103481981673533",
    content:
      "UFR UBL BDL & UFR BDL UBL (D': U'/R D R' & D': U/R D R')\nThe pure comm is alright too",
  },
  {
    id: "1172102394625130536",
    content:
      "UFR DBR DBL & UFR DBL DBR (R U' R': R' U R, D' & R U' R': D', R' U R)",
  },
  {
    id: "1172101142231130132",
    content: "UFR RDB LDB & UFR LDB RDB (R: D/R' U' R & R: D'/R' U' R)",
  },
  {
    id: "1172099234800087060",
    content: "UFR LDF RDF & UFR RDF LDF (U R': D/R U' R' & U R': D'/R U' R')",
  },
  {
    id: "1172097421308866610",
    content:
      "UFR UBR BUL & UFR BUL UBR (R': R' D' R, U2 & R': U2, R' D' R)\nR2 U is another good option",
  },
  {
    id: "1172096963810955304",
    content:
      "UFR UBR FUL & UFR FUL UBR (R: U2, R D R' & R: R D R', U2)\nR2' U' is another good option",
  },
  {
    id: "1172094416329134160",
    content:
      "UF UB RF & UF RF UB (U/L E' L' & U'/L E' L')\nR S' R' insert is great too",
  },
  {
    id: "1170160016016293978",
    content:
      "UFR UBR UBL & UFR UBL UBR (R' B' R: U', R D R' & R' B' R: R D R', U')\nAs mentioned in the vid, other options like R' D R, R' D' R, and R D R' are great too",
  },
  {
    id: "1170157456370962452",
    content: "UF LU BR & UF BR LU (S' U: L/E & S' U: L'/E)\nM' is great too",
  },
  {
    id: "1170153222141386862",
    content: "UF RU BL & UF BL RU (S U': R'/E' & S U': R/E')\nM' is great too",
  },
  {
    id: "1170094575675777165",
    content: "UF BL FD & UF FD BL (M', U L U' & U L U', M')",
  },
  {
    id: "1169884472645263480",
    content: "UFR DBR BUL & UFR BUL DBR (U R: R U' R', D' & U R: D', R U' R')",
  },
  { id: "1169882557781901313", content: "UF FL FD (M', U L' U')" },
  {
    id: "1169878951557079040",
    content:
      "UF RF DF & UF DF RF (U' L F: F, L' S' L & U' L F: L' S' L, F)\nR2' is great too, maybe better",
  },
  {
    id: "1169873774150160414",
    content: "UF RU UL & UF UL RU (R' F R, S & S, R' F R)",
  },
  {
    id: "1169873684673085513",
    content:
      "UF DF UR & UF UR DF (L: F'/L' S' L & L: F/L' S' L)\nLike for the mirror, M U2 M, U is alright too",
  },
  {
    id: "1169871070606659625",
    content:
      "UF DF UL & UF UL DF (R': F/R S R' & R': F'/R S R')\nM U2 M, U' is alright too",
  },
  {
    id: "1169867534170869771",
    content: "UF FD FL (U L' U', M')\n(Zeph's vid)",
  },
  {
    id: "1169724989713424515",
    content: "UF LF FD & UF FD LF (M': M', U' L' U & M': U' L' U, M')",
  },
  {
    id: "1169562336604979220",
    content: "UF UL DB & UF DB UL (L': M2', U L U' & L': U L U', M2')",
  },
  {
    id: "1169556518383919164",
    content:
      "UF RU FD & UF FD RU (r: M', U R' U' & r: U R' U', M')\nR' F' is great too",
  },
  {
    id: "1169519056097910844",
    content:
      "UFR UBL DFR & UFR DFR UBL (R2': U, R2 D R2' D' R2 & R2': R2 D R2' D' R2, U)",
  },
  {
    id: "1169488743284084788",
    content:
      "UFR DFL LUF & UFR LUF DFL (U' R' U: D, R U' R' & U' R' U: R U' R', D)",
  },
  {
    id: "1169486985233170473",
    content: "UB FR DF & UB DF FR (M2': U R U' & U R U', M2')",
  },
  {
    id: "1169484714353119232",
    content:
      "UFR UBL RUB & UFR RUB UBL (R' UD R: R U' R', D' & R' UD R: D', R U' R')",
  },
  {
    id: "1169129865442754641",
    content: "UF LU FL & UF FL LU (L' U': U', L S L' & L' U': L S L', U')",
  },
  {
    id: "1169128289621786644",
    content: "UF UB DF & UF DF UB (U2, M' and M', U2)",
  },
  {
    id: "1169127745272414228",
    content: "UFR UBR BDR & UFR BDR UBR (D: U', R D' R' & D: R D' R', U')",
  },
  {
    id: "1169126354994855956",
    content: "UF DL RU & UF RU DL (R': R' S' R, F & R': F, R' S' R)",
  },
  {
    id: "1168497114972692501",
    content: "UF FD DL & UF DL FD (U' L F: L/S' & U' L F: L'/S')",
  },
  {
    id: "1168493194070212650",
    content:
      "UF RU UB & UF UB RU (R: U'/R' S' R & R: U/R' S' R)\nLike the mirror, there are a number of great options. U M, U' M', and S U' are all good too.",
  },
  {
    id: "1168492838359683147",
    content:
      "UF LU UB & UF UB LU (L': U/L S L' & L': U'/L S L')\nThere are a bunch of other good options, namely S' U, U M', or U' M. This is just what I've found best personally",
  },
  {
    id: "1168431014801059852",
    content:
      "UFR RDB DFR & UFR DFR RDB (D' R: R' U R U', F2' & D' R: F2', R' U R U')\nR U'D' R' is decent too",
  },
  {
    id: "1168429760616079411",
    content: "UF RU RD & UF RD RU (F': R/E & F': R'/E)\nr U' is good too",
  },
  {
    id: "1168428052141850714",
    content: "UF RD DL & UF DL RD (R F R', S' & S', R F R')",
  },
  {
    id: "1168424816311812176",
    content:
      "UFR FDR DBL & UFR DBL FDR (R2 U': D', R' U R & R2 U': R' U R, D')\nThere are several good options for this case, including U'D and R' D' R. This is what I've found fastest personally though",
  },
  {
    id: "1168424559771394179",
    content:
      "UF UL LD & UF LD UL: U, L' E' L & L' E' L, U\nThere are like a bazillion other ways to do this case, the most common other one is to do L E L' instead of L' E' L",
  },
  {
    id: "1168423006423498802",
    content:
      "UFR BUL BDL & UFR BDL BUL: f' U2: R D' R', U' & f' U: R D' R', U\nU' R' U' and R' are more common and probably safer but I like this f' alg",
  },
  {
    id: "1168421011117580388",
    content: "UF RF BD & UF BD RF: U M: U', L E' L' & U M: L E' L', U'",
  },
  {
    id: "1168419499515592776",
    content:
      "UF BL DL & UF DL BL: U' L' U' L' U L U L U L' & L U' L' U' L' U' L U L U",
  },
  {
    id: "1168418817366573056",
    content:
      "UF LF RF & UF RF LF (UE: R'/S & U'E': L/S')\nyou don't need to mirror these cases, but personally I find it better than using the inverse",
  },
  {
    id: "1168416371709845514",
    content: "UF LU BL & UF BL LU (L' u: L'/E & L' u: L/E)\nU' l is good too",
  },
  {
    id: "1168415892430929961",
    content:
      "UFR UBL UFL & UFR UFL UBL (R' D R U': U', R' D' R & R' D R U': R' D' R, U')",
  },
  {
    id: "1168267787223973889",
    content: "UF RB RD & UF RD RB (R, D' M D & D' M D, R)\n(Rowe's vids)",
  },
  {
    id: "1168264907075112990",
    content: "UF RB FD & UF FD RB (D R D', M & M, D R D') \n(Rowe's vids)",
  },
  {
    id: "1166986043329884160",
    content:
      "UFR DFL DBR & UFR DBR DFL (U' R2': R2 U R2' U' R2, D & U' R2': D, R2 U R2' U' R2)\nR U' R' is good too",
  },
  {
    id: "1166972292732043284",
    content:
      "UFR DFR DBR & UFR DBR DFR (R2' U R2 U' R2', D' & D', R2' U R2 U' R2')",
  },
  {
    id: "1166972170270953473",
    content:
      "UFR DFL DFR & UFR DFR DFL (D, R2' U R2 U' R2' & R2' U R2 U' R2', D)",
  },
  {
    id: "1166666848931168266",
    content:
      "UFR UBL DBL & UFR DBL UBL (R' U'D' R: R U' R', D & R' U'D' R: D, R U' R')",
  },
  {
    id: "1166664499705688146",
    content:
      "UFR UBR DFR & UFR DFR UBR (R' D R U' R D' R', U & U, R' D R U' R D' R')\nU' R' D R is another great option",
  },
  {
    id: "1166664301650645012",
    content:
      "UFR UBR DBR & UFR DBR UBR (U', R D' R' U R' D R & R D' R' U R' D R, U')\nU R D' R' is another great option",
  },
  { id: "1166624346622677002", content: "UF FR UB (R' U': R2, S)" },
  {
    id: "1165964047431258132",
    content: "UF BU LU & UF LU BU (L': M', U' L U & L': U' L U, M')",
  },
  {
    id: "1165963826022326402",
    content: "UF BU DL & UF DL BU (UD: S, R' F' R & UD: R' F' R, S)",
  },
  {
    id: "1165963567145681010",
    content: "UF BU UR & UF UR BU (R': U' R U, M & R': M, U' R U)",
  },
  {
    id: "1165955173450002522",
    content: "UF BU LD & UF LD BU (U'D: R' F' R, S & U'D': S, R' F' R)",
  },
  {
    id: "1165904951403352084",
    content: "UF BU RF & UF RF BU (M', U R U' & U R U', M')",
  },
  {
    id: "1165900661142065162",
    content: "UF BU FD & UF FD BU (U': R' F' R, S & U': S, R' F' R)",
  },
  {
    id: "1165899700306726942",
    content: "UF BU DF & UF DF BU (U: S, R' F' R & U: R' F' R, S)",
  },
  {
    id: "1165888563523620904",
    content:
      "UF LU FR & UF FR LU (S' U: L'/E' & S' U: L/E')\nM' into lUE is decent too",
  },
  {
    id: "1165875535310770197",
    content:
      "UF UR UFR UBR [LUB] (R U R' U' R' U' F R f' R' U R S U')\nThere are good RUD options too, this is just what I personally use",
  },
  { id: "1165874517911019620", content: "UF UB FR (R' U': S, R2)" },
  {
    id: "1165874162401824808",
    content: "UF BL RB & UF RB BL (L U L', E & E, L U L')",
  },
  {
    id: "1165873812286488606",
    content:
      "UF BD RD & UF RD BD (U': S', R B R' & U': R B R', S')\nU' M is good too",
  },
  {
    id: "1165811991940698235",
    content: "UF LB RU & UF RU LB (l: U/M' & l: U'/M')\nR F is nice too",
  },
  {
    id: "1165809274178502687",
    content:
      "UF FD LD & UF LD FD (U: S, L F L' & U: L F L', S)\nU: R' D' R, S' & inverse are good too",
  },
  {
    id: "1165808132392484895",
    content:
      "UFR FDR DBR & UFR DBR FDR (U R D': U', R' D R & U R D': R' D R, U')",
  },
  {
    id: "1165806839213076551",
    content:
      "UFR FDR BDR & UFR BDR FDR (D R: D/R' U' R & D R: D'/R' U' R)\nR U R' U' is great too",
  },
  {
    id: "1165804347549032538",
    content:
      "UF UB BD & UF BD UB (U' R' B: R/S & U R' B: R/S)\nU M' or U' M' are great too",
  },
  {
    id: "1165801981747679232",
    content: "UFR FDL BUR & UFR BUR FDL (R' F: R U' R', D & R' F: D, R U' R')",
  },
  {
    id: "1165801829318262876",
    content:
      "UFR FDL BUR & UFR BUR FDL (U R' U': D, R U R' & U R' U': R U R', D)",
  },
  {
    id: "1165610174669672530",
    content:
      "UF FR LD & UF LD FR (U: S, R U2' R' & U: R U2' R', S)\nThere are a whole bunch of good options for this case, like D, L' E', R' S, R U into RUS, or U into LFS. This is just what I usually use at the moment.",
  },
  {
    id: "1165608502845251584",
    content:
      "UF FR UL & UF UL FR (L' E2' L, U & U, L' E2' L)\nRUS pure is great for this too",
  },
  {
    id: "1165608063538053150",
    content: "UF FR LB & UF LB FR (R: U', R E' R' & R: R E' R', U')",
  },
  {
    id: "1165607772793098290",
    content: "UF FD FR & UF FR FD (U' R U, M' & M', U' R U)",
  },
  {
    id: "1165607570283708456",
    content: "UF FR DL & UF DL FR (U: L/E' & U: L'/E')",
  },
  {
    id: "1165601942207205457",
    content:
      "UF FL DL & UF DL FL (U' L U L U' L' U' L' U' L U2' & U2' L' U L U L U L' U' L' U)",
  },
  {
    id: "1165552930020151387",
    content:
      "UF FD RB & UF RB FD (U M', L' E L, U & U M': U, L' E L)\nThe RDM alg is probably faster, but this may be safer/easier",
  },
  {
    id: "1165518298843189300",
    content: "UF RF RB & UF RB RF (M' U': R', S & M' U': R/S)",
  },
  {
    id: "1165448263676215346",
    content: "UFR LUB LDB & UFR LDB LUB (R D': R D R', U & R D': U, R D R')",
  },
  {
    id: "1165447501671845990",
    content:
      "UF BR DR & UF DR BR (U R U R U' R' U' R' U' R & R' U R U R U R' U' R' U')",
  },
  {
    id: "1165421957077020783",
    content: "UF BU FR & UF FR BU (U' R U, M & M, U' R U)",
  },
  {
    id: "1165421725773742100",
    content: "UF BU BD & UF BD BU (U': R B R', S & U': S, R B R')",
  },
  {
    id: "1165421294788018196",
    content: "UF BL BU & UF BU BL (M, U L U' & U L U', M)",
  },
  {
    id: "1165421165939003505",
    content: "UF BU RD & UF RD BU (U'D': R' F' R, S & U'D': S, R' F' R)",
  },
  {
    id: "1165380728700276848",
    content: "UF LF BL & UF BL LF (E', L U L' & L U L', E')",
  },
  {
    id: "1165380551323168869",
    content: "UF FR BR & UF BR FR (U: R'/S & U: R/S)",
  },
  {
    id: "1165380396809207890",
    content: "UF FL RD & UF RD FL (U': S', R' F2 R & U': R' F2 R, S')",
  },
  {
    id: "1165380210137518240",
    content: "UF FL BL & UF BL FL (U': L/S' & U: L'/S')",
  },
  {
    id: "1165119864634089542",
    content: "UF UR UFR FUL (r B' U2 R2 F R F' R U2 r' U L U L')",
  },
  {
    id: "1165064124091355217",
    content: "UFR BUL BDR & UFR BDR BUL (D' R': R' U R, D & D' R': D, R' U R)",
  },
  {
    id: "1165062517995864175",
    content:
      "UF UL DL & UF DL UL (L U': L/S' & L U': L'/S')\nU, L E' L2' E L & inverse are good too",
  },
  {
    id: "1165059796618203189",
    content:
      "UF UR DR & UF DR UR (R' U: R'/S & R' U: R/S)\nU', R' E R2 E' R' & inverse are good too",
  },
  {
    id: "1164855578401718282",
    content: "UF BU DB & UF DB BU (U: S, R B R' & U: R B R', S)",
  },
  {
    id: "1164854088199053432",
    content: "UF BU DR & UF DR BU (UD': S, R' F' R & UD': R' F' R, S)",
  },
  {
    id: "1164608437213200524",
    content: "UF LB DF & UF DF LB (l' U: S', L2 & l' U: L2, S')",
  },
  {
    id: "1164504637131472967",
    content:
      "UFR LUB DFL & UFR DFL LUB (D' R: R D' R', U & D' R: U, R D' R')\nR to pure is good too",
  },
  {
    id: "1164496798619017266",
    content:
      "UFR BUR BDL & UFR BDL BUR (D R' U: D, R U' R' & D R' U: R U' R', D)\nR' U is another great option",
  },
  {
    id: "1164491742393942068",
    content: "UF BD FR & UF FR BD (U': R, U' M U & U': U' M U, R)",
  },
  {
    id: "1164487200289849384",
    content:
      "UFR RDF BUL & UFR BUL RDF (R': D, R' U R & R': R' U R, D)\nThere are other good options too, like regripping left hand to do the pure, or R U R' U' R', F'",
  },
  {
    id: "1164429350544887909",
    content:
      "UF FR DR & UF DR FR (U R' U' R' U R U R U R' U2 & U2 R U' R' U' R' U' R U R U')",
  },
  {
    id: "1164329541574070272",
    content: "Ufr Rdf Bdr & Ufr Bdr Rdf (d': l' U l, d' & d': d', l' U l)",
  },
  {
    id: "1164326156653305936",
    content: "UF FR RB & UF RB FR (R U' R', E' & E', R U' R')",
  },
  {
    id: "1164278021688147979",
    content:
      "UFR UBL BUR & UFR BUR UBL (R' D: U/R D R' & R' D: U'/R D R')\nR' D' is another decent option",
  },
  {
    id: "1164276124226945124",
    content: "UF RU BU & UF BU RU (R: U R' U', M' & R: M', U R' U')",
  },
  {
    id: "1164275282799231067",
    content:
      "UFR DFR DBR & UFR DBR DFR (R2' U R2 U' R2', D' & D', R2' U R2 U' R2')",
  },
  {
    id: "1164274029130170439",
    content: "UFR UBR LUB & UFR LUB UBR (R: U, R D R' & R: R D R', U)",
  },
  {
    id: "1164109437330530325",
    content: "UFR RDB DFL & UFR DFL RDB (U' R': R' D R, U & U' R': U, R' D R)",
  },
  {
    id: "1164107963619885126",
    content: "UFR FUL BUR & UFR BUR FUL (R D': U/R' D' R & R D': U'/R' D' R)",
  },
  {
    id: "1164050741359562873",
    content: "UF LF BU & UF BU LF (U' L' U, M' & M', U' L' U)",
  },
  {
    id: "1164046347687706664",
    content: "UF UB FR & UF FR UB (R' U': S, R2' & R' U: S, R2')",
  },
  {
    id: "1164045548085575768",
    content: "UF UB LB & UF LB UB (U'/R E' R' & U/R E' R')",
  },
  {
    id: "1164045438681370654",
    content:
      "UF UB LD & UF LD UB (U/L' E' L & U'/L' E' L)\nU into RUS is great for this too",
  },
  {
    id: "1164031807176577094",
    content: "UF FR BL & UF BL FR (R' U': R'/E' & R' U': R/E')",
  },
  {
    id: "1164029282545303572",
    content: "UF BR FL & UF FL BR (R U': R/E & R U': R'/E)",
  },
  {
    id: "1163979421351432263",
    content:
      "UFR LUF BDL & UFR BDL LUF (R' U': D2, R U R' & R' U': R U R', D2)\nD R' U' and pure are good options too",
  },
  {
    id: "1163936405450403840",
    content:
      "UFR BDL BDR & UFR BDR BDL (U': R', U' L U & U': U' L U, R')\nR' and D2 are good options for this case too",
  },
  {
    id: "1163920940053311588",
    content: "UF FR LF & UF LF FR (R U' R', E & E, R U' R')",
  },
  {
    id: "1163719479172276344",
    content:
      "UFR LUB RUB & UFR RUB LUB (R: R2' D R2 D' R2', U & R: U, R2' D R2 D' R2')",
  },
  {
    id: "1163700153413283931",
    content:
      "UFR RUB FUL & UFR FUL RUB (R': R2 D' R2' D R2, U' & R': U', R2 D' R2' D R2)",
  },
  {
    id: "1163699653464829962",
    content: "UF DR DB & UF DB DR (D' R' F/R S' R' & D' R' F'/R S' R')",
  },
  {
    id: "1163190612997177454",
    content: "UFR FDL RUB & UFR RUB FDL (f': U/R' D' R & f': U'/R' D' R)",
  },
  {
    id: "1163045797663875153",
    content:
      "UFR RDF BUR & UFR BUR RDF (R' U: R U' R', D' & R' U: D', R U' R')",
  },
  { id: "1162907997463396352", content: "UF LB LD (L', U S' U')" },
  {
    id: "1162907778453610516",
    content: "UF LD LB (U S' U', L')\n(Zeph's vid)",
  },
  {
    id: "1162897723666747476",
    content:
      "UFR RUB RDF & UFR RDF RUB (R' F' R: U/R' D' R & R' F' R: U'/R' D' R)",
  },
  {
    id: "1162897508779962468",
    content:
      "UFR LDB DFL & UFR DFL LDB (D L' U: F2, U' L U L' & D L' U: U' L U L', F2)\n(These comms can also be written with the cancellation the other way, so DU L': L U' L' U, F2 & DU L': F2, L U' L' U)",
  },
  {
    id: "1162896908193386556",
    content:
      "UFR LDF DBL & UFR DBL LDF (D R: R' U R U', F2' & D R: F2', R' U R U')",
  },
  {
    id: "1162882833354850344",
    content:
      "UFR UFL DFL & UFR DFL UFL (U': U R' U' R: F2' & U': F2', U R' U' R)",
  },
  {
    id: "1162878557345828955",
    content: "UF RD DB & UF DB RD (U': S, R' B R & U': R' B R, S)",
  },
  {
    id: "1162859253963432091",
    content: "UFR LUF RUB & UFR RUB LUF (f': U/R' D R & f': U'/R' D R)",
  },
  {
    id: "1162850406490185848",
    content: "UF FD RD & UF RD FD (U': S', R' F' R & U': R' F' R, S')",
  },
  {
    id: "1162836636787282020",
    content: "UF FD DR & UF DR FD (U R' F': R'/S & U R' F': R/S)",
  },
  {
    id: "1162825202690957373",
    content:
      "UF UR DL & UF DL UR (U' L' U' L U L U L U' L' & L U L' U' L' U' L' U L U)\nThere are other good options for this case, such as S' R' F or l F",
  },
  {
    id: "1162824781477974096",
    content:
      "UF UL DR & UF DR UL (U R U R' U' R' U' R' U R & R' U' R U R U R U' R' U')",
  },
  {
    id: "1162824517702406274",
    content: "UFR UBR DBL & UFR DBL UBR (R' B: D', R U R' & R' B: R U R', D')",
  },
  {
    id: "1162608639488557056",
    content:
      "UFR LDF BUL & UFR BUL LDF (R B' R': R' D R, U & R B' R': U, R' D R)",
  },
  {
    id: "1162607114917781625",
    content:
      "UFR LUF BUR & UFR BUR LUF (R', U L U' & U L U', R')\nR' F is another decent option",
  },
  {
    id: "1162606951243468880",
    content: "UFR LUB BUR & UFR BUR LUB (R', F' L F & F' L F, R')",
  },
  {
    id: "1162606520966586418",
    content:
      "UFR FUL FDR & UFR FDR FUL (R': R D' R' D, F2 & R': F2, R D' R' D)",
  },
  {
    id: "1162551888219222086",
    content:
      "UFR FDL BUL & UFR BUL FDL (D R': D, R' U R & D R': R' U R, D)\n(Zeph's vid)\nThere are several other good options too, like U R' F' or D R U R' U'D' R' F' R U R U' R' F & inverse",
  },
  {
    id: "1162548983844053072",
    content:
      "Ufr Fdr Rdb & Ufr Rdb Fdr (U: r U' r', d' & U: d', r U' r')\n(Ryan Eckersley's vid)",
  },
  {
    id: "1162542339890356234",
    content:
      "UFR FDR DFL & UFR DFL FDR (R: R' U R U', F2' & R: F2', R' U R U')",
  },
  {
    id: "1162536963853787176",
    content: "UFR FDR LUF & UFR LUF FDR (R: R' U R U', F & R: F, R' U R U')",
  },
  {
    id: "1162535172781121648",
    content:
      "UFR FDR LDB & UFR LDB FDR (U R U': U', R D' R' & U R U': R D' R', U')",
  },
  {
    id: "1162530961100128286",
    content: "UF RU FR & UF FR RU (R U: U, R' S' R & R U: R' S' R, U)",
  },
  {
    id: "1162528104519049276",
    content:
      "UFR FDL DFR & UFR DFR FDL (L' U: F2, U' L U L' & L' U: U' L U L', F2)\n(These comms can also be written with the cancellation the other way, so U L': L U' L' U, F2 & U L': F2 L U' L' U)",
  },
  {
    id: "1162527841427132466",
    content: "UF RD FR & UF FR RD (R' f: R/S' & R' f: R'/S')",
  },
  {
    id: "1162526917061259274",
    content:
      "UFR FDR FDL & UFR FDL FDR (R': F', R D' R' D & R': R D' R' D, F')",
  },
  {
    id: "1162504820687642744",
    content:
      "UF DB DF (M': U2, M') & UF DF DB ((u2 M')2)\nYou can of course mirror the fingertrick shown here if you're more comfortable with righty M moves",
  },
  {
    id: "1162496203863363624",
    content: "UF UL FL (E: U, L E' L')\n(Graham's vid)",
  },
  {
    id: "1162496067082932225",
    content: "UF FL UL (E: L E' L', U)\n(Graham's vid)",
  },
  {
    id: "1162495900548092079",
    content: "UF FL UR (R E2 R', U')\n(Graham's vid)",
  },
  {
    id: "1162495803756134460",
    content: "UF UR FL (U', R E2 R')\n(Graham's vid)",
  },
  {
    id: "1162495571588825239",
    content: "UF DL DF & UF DF DL (L: F/L' S L & L: F'/L' S L)",
  },
  { id: "1162495381993689148", content: "UF UR FR (E': U', R' E R)" },
  {
    id: "1162337230459785316",
    content: "UF FR UR (E': R' E R, U')\n(Graham's vid)",
  },
  {
    id: "1162336286380671130",
    content: "UF FD UR (R: U' R' U, M')\n(Graham's vid)",
  },
  {
    id: "1162336181955088454",
    content: "UF UR FD (R: M': U' R' U)\n(Graham's vid)",
  },
  {
    id: "1162331729072230420",
    content: "UF DB FR (U' R U, M2')\n(Zeph's vid)",
  },
  { id: "1162329210409467995", content: "UF FR DB (M2', U' R U)" },
  { id: "1162325716197703690", content: "UF UR DB (R: M2', U' R' U)" },
  {
    id: "1162323856900497459",
    content: "UF DB UR (R: U' R' U, M2')\n(Zeph's vid)",
  },
  {
    id: "1162323475604705281",
    content:
      "UF UB FD & UF FD UB (R' F': R U R', E & R' F': E, R U R')\n(Zeph's vid)",
  },
  {
    id: "1162260666799890503",
    content:
      "UF UB BR (R U: R2', S or R U': S, R2') & UF BR UB (R U': R2', S or R U: S, R2')",
  },
  {
    id: "1162251478514286603",
    content: "UF BR BU & UF BU BR (M, U' R' U & U' R' U, M)",
  },
  {
    id: "1162198178150502451",
    content: "UFR DBL BDR & UFR BDR DBL (R U': D'/R' U R & R U': D/R' U R)",
  },
  {
    id: "1162196368018919549",
    content: "UF RB DB & UF DB RB (M/U R' U' & M'/U R' U')",
  },
  {
    id: "1162194916441587782",
    content: "UF RF DB & UF DB RF (M/U R U' & M'/U R U')",
  },
  {
    id: "1162175616855068702",
    content: "UF BD UR & UF UR BD ((M U' M' U')2 & (U M U M')2)",
  },
  {
    id: "1161215567781433384",
    content: "UF FR FL & UF FL FR (R' U': R/E & R' U': R'/E)",
  },
  {
    id: "1161213976244396064",
    content:
      "UF LD LU & UF LU LD (F: L/E' & F: L'/E')\nThere are other good options for this case, such as l' U",
  },
  {
    id: "1161087244891856976",
    content: "UFR LUF UBL & UFR UBL LUF (f: R' D' R, U2 & f: U2, R' D' R)",
  },
  {
    id: "1161040142052630652",
    content: "UF UR UB (R2' U': R2, S) & UF UB UR (R2' U: R2, S)",
  },
  { id: "1161036942083899503", content: "UF UR UB (R2: U'/S')" },
  {
    id: "1160699508926193695",
    content:
      "UFR RDB DBL & UFR DBL RDB (UD' R' D r2 U' R U r2' U' & U r2 U' R' U r2' D' R DU')\nThis alg is just a widestyle version of U: D' R' D, L2",
  },
  { id: "1160396255734812772", content: "UF DF LU (L' F': E', L2)" },
  { id: "1160396167264342126", content: "UF LU DF (L' F': L2, E')" },
  {
    id: "1159989544918208614",
    content:
      "UF RF RD & UF RD RF (R', U' S U & U' S U, R'), UF RD RB & UF RB RD (U' S U, R & R, U' S U)\n(Zeph's vid)",
  },
  { id: "1159975919277068368", content: "🎥・comm exec vids" },
  {
    id: "1159972029450166374",
    content: "UFR BUL BUR & UFR BUR BUL (U' L' U, R & R, U' L' U)",
  },
  {
    id: "1159971960470646864",
    content:
      "UFR LDB BUR & UFR BUR LDB (U' L U, R & R, U' L U)\nU' R U and D' R U' are other good options for this case",
  },
  {
    id: "1159792836846301236",
    content: "UF RU LF & UF LF RU (L'M: U'/M' & L'M: U/M')\nL2 F' is good too",
  },
  {
    id: "1159792591227850823",
    content: "UF LU RF & UF RF LU (RM: U/M' & RM: U'/M')\nR2' F is good too",
  },
  {
    id: "1159792248511287337",
    content: "UF LD RB & UF RB LD (L F': E, L2' & L F': L2', E)",
  },
  {
    id: "1159791994357424199",
    content: "UFR LUF LUB & UFR LUB LUF (U' R' U, L & L, U' R' U)",
  },
  {
    id: "1159791898416922684",
    content: "Gonna post vids of comm execs in here",
  },
  {
    id: "1256933755478868018",
    content:
      "UFR DBR DBL and UFR DBL DBR \n(U r2 D’, R2 and R2, U r2 D’)\nAnother good option is \n(R U’ R’: R’ U R, D’ and R U’ R’: D’, R’ U R)",
  },
  {
    id: "1284347002766757981",
    content: "UF UR DR & UF DR UR: R' U: R'/S & R' U: R/S",
  },
  {
    id: "1290068552057098392",
    content:
      "UF UR UFR UBL  r2 U' r2 U r2 D' r2 D r2 D' r2 U r2 D r2  There's another video for a domino Y perm (go try it), but I like doing the alg in the reverse direction",
  },
  {
    id: "1290723931942293525",
    content: "Ubr Fur Rdb & Ubr Rdb Fur (S': r, Uw' l' Uw & S': Uw' l' Uw, r)",
  },
  {
    id: "1290724097185284166",
    content: "Ubr Fdr Dbl & Ubr Dbl Fdr (U: U l2 U', r & U: r, U l2 U')",
  },
  {
    id: "1290724296813056071",
    content: "Ubr Ful Dfr & Ubr Fdr Ful (r2, U' l' U & U' l' U, r2)",
  },
  {
    id: "1290724459292135465",
    content:
      "Ubr Fur Bdr & Ubr Bdr Fur (Uw' r': r' u r, U & Uw' r': U, r' u r)",
  },
  {
    id: "1290724593215995948",
    content: "Ubr Ful Bdr & Ubr Bdr Ful (r', U' l' U & U' l' U, r')",
  },
  {
    id: "1290724775244595373",
    content: "Ubr Fdl Bur & Ubr Bur Fdl (U: r', U l' U' & U: U l' U', r')",
  },
  {
    id: "1290724912062791822",
    content: "Ubr Ful Bdl & Ubr Bdl Ful (u' l: l u l', U' & u' l: U', l u l')",
  },
  {
    id: "1290725031571095613",
    content:
      "Ubr Fdl Bul & Ubr Bul Fdl (u' l': U2, l' u l & u' l': l' u l, U2)",
  },
  {
    id: "1290725168964046990",
    content: "Ubr Lub Rub & Ubr Rub Lub (R': u' / l' U' l & R': u / l' U' l)",
  },
  {
    id: "1290725296827269171",
    content: "Ubr Luf Ruf & Ubr Ruf Luf (L': u' / l' U' l & L': u / l' U' l)",
  },
  {
    id: "1290725887213305916",
    content: "Ubr Ruf Fur & Ubr Fur Ruf (F': u, l' U' l & F': l' U' l, u)",
  },
  {
    id: "1290726031661203478",
    content: "Ubr Fdr Ldb & Ubr Ldb Fdr (F: l' U2 l, d & F: d, l' U2 l)",
  },
  {
    id: "1290728904625225740",
    content: "Ubr Fdr Dfr & Ubr Dfr Fdr (d2: r2, U' l U & d2: U' l U, r2)",
  },
  {
    id: "1290729054269472849",
    content: "Ubr Fdl Dfl & Ubr Dfl Fdl (d2: U' l2 U, r' & d2: r', U' l2 U)",
  },
  {
    id: "1294805419369304115",
    content:
      "UF BD FD and UF FD BD\n(U M' U' M U2 M U M' U and U M U M' U2 M' U' M U)\n\nThis can be thought of as widened U M' U' M,D2",
  },
  {
    id: "1294806504280424510",
    content:
      "UF BD RB and UF RB BD\n(U M:U',R' S' R and U M:R' S' R,U')\nLefty insert is also a good option",
  },
  {
    id: "1295349769337704541",
    content: "UFR RUB BUL and UFR BUL RUB(U R:R D R',U2 and U R:U2,R D R')",
  },
  {
    id: "1295351545222791169",
    content:
      "UFR RUB LDF and UFR LDF RUB(U R:U/R' D R and U R:U'/R' D R) you can also soft regrip at the start",
  },
  {
    id: "1295351805181431810",
    content: "UFR RUB RDB and UFR RDB RUB(U R:U/R' D' R and U R:U'/R' D' R)",
  },
  {
    id: "1295352367583072286",
    content: "UFR RUB FDR and UFR FDR RUB(U' R':U'/R D R' and U' R':U/R D R')",
  },
  {
    id: "1296714245953552468",
    content:
      "UF UR UFR RUB [LUF] (R' U' R UD' R U' R U R U' R2' UD)\nLefty push is also good for the last U",
  },
  {
    id: "1298246155800547391",
    content: "UF UR UFR RUB (U R' U R U' x U L' U L U2 R U' R' U)",
  },
  {
    id: "1300078688171327618",
    content: "UF LD DR and UF DR LD (L' F' L,S and S,L' F' L)",
  },
  {
    id: "1301839350623113258",
    content: "UF BU LD & UF LD BU (M', U' L2 U & U' L2 U, M')",
  },
  {
    id: "1301839608933384193",
    content: "UF LU LD & UF LD LU (S': D'/M & S': D/M)",
  },
  {
    id: "1301839745713963060",
    content: "UF DB DL & UF DL DB (U L2 U', M2 & M2, U L2 U')",
  },
  {
    id: "1301839892774649867",
    content: "UF BU RD & UF RD BU (M', U R2 U' & U R2 U', M')",
  },
  {
    id: "1301840217761775666",
    content: "UF UR DB & UF DB UR (R U R': U'/M & R U R': U/M)",
  },
  {
    id: "1301840476491485265",
    content: "UF UL DB & UF DB UL (U l: U' / R' E R & U l: U / R' E R)",
  },
  {
    id: "1302459407061483550",
    content:
      "UFR UBR DBL and UFR DBL UBR( R' F' R,B2 and B2,R' F' R)\nR' B is probably the best but I find this much more consistent",
  },
  {
    id: "1303310535931990016",
    content:
      "UF LD BD (M D M' D M D M' D) Relax your right ring and pinky to give more mobility to your right index. Due to the asymmetry of this algorithm, I prefer using something different for the inverse direction (U: for example)",
  },
  {
    id: "1303310801641406587",
    content:
      "UF BD RB (R D M D M' D M D M' R') Slide your left middle finger over the back center right after the last M' to stabilize the R'. Due to the asymmetry of this algorithm, I prefer using something different for the inverse direction (u r:/ for example)",
  },
  {
    id: "1303310945552171060",
    content:
      "UF LB BD (L' M D M' D M D M' D L) The L' is a setup into the MD alg for UF LD BD. Due to the asymmetry of this algorithm, I prefer using something different for the inverse direction (u' l':/ for example)",
  },
];

let count = 1;
for (const item of data) {
  await saveData(`INSERT INTO comms (message_id, content) VALUES (?, ?)`, [
    item.id,
    item.content,
  ]);
  console.log(count);
  count++;
}

console.log("done");
