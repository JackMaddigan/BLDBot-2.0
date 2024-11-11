// fetch records in last 15 min

const { fetchWCALiveQuery } = require("../bld-summary/bld-summary-helpers");
const { recentRecordsQuery } = require("../bld-summary/queries");
// movr filrs to common dir

async function fetchRecords() {
  let response = (await fetchWCALiveQuery(recentRecordsQuery))?.data
    .recentRecords;
  response.filter(
    (item) =>
      ["333bf", "444bf", "555bf", "333mbf"].includes(
        item.roumd.competitioEvent.event.id
      ) // and time and add eventId set  to global thing/
  ) / console.log(response);
  for (const record of response) {
    const resultId = record.id + record.attemptResult;
    // checkmdb for result id
    // if not there then add to list and save to db
  }
}

fetchRecords();
