const eventIds = new Set(["333bf", "444bf", "555bf", "333mbf"]);

/**
 * Ranks two mbld attempts, returns number of attempt that is better (1 or 2)
 * In case of tie the first parameter should be the attempt you want to be tied and be ranked better
 * @param {object} r1 mbld object from decodeMbldResult
 * @param {object} r2 mbld object from decodeMbldResult
 * @returns 1 or 2 depending if first or second result is better
 */
function rankMbldResults(r1, r2) {
  if (!r2) return 1;
  if (r1.points > r2.points) return 1;
  if (r2.points > r1.points) return 2;
  if (r1.seconds < r2.seconds) return 1;
  if (r2.seconds < r1.seconds) return 2;
  if (r1.unsolved <= r2.unsolved) return 1;
  return 2;
}

/**
 * Decodes WCA MBLD integer into useful information
 * @param {integer} value WCA standard MBLD result
 * @returns Object of MBLD result data
 */
function decodeMbldResult(value) {
  // 0DDTTTTTMM
  //   get MM
  const unsolved = value % 100;
  // solved = difference + missed
  const solved = 99 - Math.floor(value / 1e7) + unsolved;
  // seconds is TTTTT so get rid of MM first then get rid of DD
  const seconds = Math.floor(value / 100) % 1e5;
  return {
    solved: solved,
    attempted: solved + unsolved,
    points: solved - unsolved,
    seconds: seconds,
    unsolved: unsolved,
  };
}

/**
 * Function to parse and compare dates
 * @param {string} date1 yyyy-mm-dd
 * @param {string} date2 yyyy-mm-dd
 * @returns boolean if date1 is before date2
 */
function isDateBeforeOrEqual(date1, date2) {
  return new Date(date1) <= new Date(date2);
}

/**
 * Run and return a graphql query
 * @param {string} query - the GRAPHQL query
 * @returns the result of the GRAPHQL query from the wca live api
 */
async function fetchWCALiveQuery(query) {
  try {
    const url = "https://live.worldcubeassociation.org/api/graphql";
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query: query,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// FORMAT OF TOP RESULT
/*
{
  type: best/average
  eventId: 333bf/444bf/555bf/333mbf
  best: Integer
  link: String
  recordTag: String
  person: {
    country: {
      continentName: "Oceania",
      name: "New Zealand",
      iso2: "NZ"
    },
    name: "Jack Maddigan",
    wcaId: "2020MADD02",
  },
}
*/

function makeCubingChinaDataToResultObj(
  attempts,
  average,
  averageRecordTag,
  best,
  singleRecordTag,
  personName,
  wcaId,
  countryName,
  countryIso2
) {
  return {
    attempts,
    average,
    averageRecordTag:
      averageRecordTag !== "WR" &&
      averageRecordTag !== "NR" &&
      averageRecordTag !== null
        ? "CR"
        : null,
    best,
    id: null,
    person: {
      country: {
        continentName: null,
        iso2: countryIso2,
        name: countryName,
      },
      name: personName,
      wcaId: wcaId,
    },
    singleRecordTag:
      singleRecordTag !== "WR" &&
      singleRecordTag !== "NR" &&
      singleRecordTag !== null
        ? "CR"
        : null,
  };
}

module.exports = {
  rankMbldResults,
  decodeMbldResult,
  isDateBeforeOrEqual,
  fetchWCALiveQuery,
  eventIds,
  formatDateToYYYYMMDD,
  makeCubingChinaDataToResultObj,
};
