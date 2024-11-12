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

const eventIds = new Set(["333bf", "444bf", "555bf", "333mbf"]);

module.exports = {
  formatDateToYYYYMMDD,
  fetchWCALiveQuery,
  isDateBeforeOrEqual,
  eventIds,
};
