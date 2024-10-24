const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "./bldbot.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

// db.run(`DROP TABLE IF EXISTS ee`);
// db.run(`DROP TABLE IF EXISTS results`);
// db.run(`DROP TABLE IF EXISTS comms`);

// Initialise results table
db.run(`
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            username TEXT NOT NULL,
            eventId TEXT NOT NULL,
            attempts TEXT NOT NULL,
            best INTEGER,
            average INTEGER,
            UNIQUE(userId, eventId)
        )
    `);
db.run(`
        CREATE TABLE IF NOT EXISTS key_value_store (
            key TEXT PRIMARY KEY UNIQUE,
            value TEXT
        )
    `);
db.run(`
        CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recordId Text,
            recordTime INTEGER
        )
    `);

db.run(
  `CREATE TABLE IF NOT EXISTS comms (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)`
);

db.run(`CREATE TABLE IF NOT EXISTS summary_results_to_beat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            eventId Text UNIQUE,
            best INTEGER,
            average INTEGER
  )`);

// test();
async function test() {
  // console.log(await readData(`SELECT * FROM summary_results_to_beat`));
  // const data = {
  //   "333bf": { best: 2007, average: 2524 },
  //   "444bf": { best: 11054, average: 15139 },
  //   "555bf": { best: 28263, average: 44173 },
  //   "333mbf": { best: 650350302, average: null },
  // };
  // for (const [key, val] of Object.entries(data)) {
  //   await saveData(
  //     `INSERT INTO summary_results_to_beat (eventId, best, average) VALUES (?, ?, ?)`,
  //     [key, val.best, val.average]
  //   );
  // }
}

async function saveData(query, parameters) {
  try {
    return await new Promise((resolve, reject) => {
      db.run(query, parameters, function (err) {
        if (err) {
          console.error(err.message);
          reject();
        }
        console.log(`Row inserted or updated with rowid ${this.lastID}`);
        resolve();
      });
    });
  } catch (err_1) {
    return console.error(err_1);
  }
}

function readData(query, parameters) {
  return new Promise((resolve, reject) => {
    db.all(query, parameters, function (err, rows) {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve(rows);
    });
  });
}

function deleteData(query, parameters) {
  return new Promise((resolve, reject) => {
    db.run(query, parameters, function (err) {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve();
    });
  });
}

// async function saveComms(allMsgContent, allMsgIds) {
//   db.serialize(() => {
//     // Prepare the insert statement
//     const stmt = db.prepare(
//       "INSERT OR REPLACE INTO comms (id, content) VALUES (?, ?)"
//     );

//     // Loop through the messages and execute the insert statement for each one
//     for (let i = 0; i < allMsgIds.length; i++) {
//       stmt.run(allMsgIds[i], allMsgContent[i], (err) => {
//         if (err) {
//           console.error("Error inserting data:", err.message);
//         }
//       });
//     }

//     // Finalize the statement to release resources
//     stmt.finalize();
//   });
// }

module.exports = {
  readData,
  saveData,
  deleteData,
  //   saveComms,
};
