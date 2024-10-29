const { toCenti } = require("../helpers/converters");

class ResultObj {
  person;
  best;
  average;
  eventId;
  attempts;
  aRT;
  sRT;
  link;
  constructor() {}
  scoreAndTimeToWCAMBLD(parts) {
    if (parts.includes("dnf")) return -1;
    if (parts.includes("dns")) return -2;
    // parts.length should be 2, first part being the score and second being the time
    // 0DDTTTTTMM
    const [solved, attempted] = parts[0].split("/").map((part) => Number(part));
    const TTTTT = (toCenti(parts[1]) / 100).toString().padStart(5, "0");
    const MM = (attempted - solved).toString().padStart(2, "0");
    const DD = 99 - (solved - (attempted - solved));
    return Number(DD + TTTTT + MM);
  }

  createCubingChinaResult(name, wcaId, eventId, best, average, attempts, link) {
    this.eventId = eventId;
    this.link = link;
    if (eventId == "333mbf") {
      // split best string from table into vars
      const [time, bestScore, sRT] = best
        .split(/\s+/)
        .reverse()
        .map((part) => (!part ? null : part.toLowerCase()));

      // set this.best to the WCA attempt number made from the result
      this.best = this.scoreAndTimeToWCAMBLD([bestScore, time]);

      // set attempts array to array containing WCA numbers for all the attempts
      const attemptsParts = attempts
        .split(/\s+/)
        .filter((part) => /\S/.test(part))
        .map((part) => part.trim().toLowerCase());
      const attemptNumbers = [];
      for (let i = 0; i < attemptsParts.length; i += 2) {
        attemptNumbers.push(
          this.scoreAndTimeToWCAMBLD([
            attemptsParts[i],
            attemptsParts[i + 1] || null,
          ])
        );
        // if dnf or dns go back one place since dnf and dns only have one part
        if (attemptNumbers[attemptNumbers.length - 1] < 0) i--;
      }
      this.attempts = attemptNumbers;
      this.sRT = ["nr", "wr"].includes(sRT)
        ? sRT.toUpperCase()
        : sRT
        ? "CR"
        : null;
      // no average for MBLD
      this.average = 0;
      this.aRT = null;
    } else {
      // 3BLD 4BLD 5BLD
      const [bestResult, sRT] = best
        .split(/\s+/)
        .reverse()
        .map((part) => part.toLowerCase());
      const [averageResult, aRT] = average
        .split(/\s+/)
        .reverse()
        .map((part) => part.toLowerCase());
      this.best = toCenti(bestResult);
      this.sRT = ["nr", "wr"].includes(sRT)
        ? sRT.toUpperCase()
        : sRT
        ? "CR"
        : null;
      this.average = toCenti(averageResult);
      if (this.average == 0) this.average = -1;
      this.aRT = ["nr", "wr"].includes(aRT)
        ? aRT.toUpperCase()
        : aRT
        ? "CR"
        : null;
      this.attempts = attempts
        .split(/\s+/)
        .filter((attempt) => /\S/.test(attempt))
        .map((attempt) => toCenti(attempt));
    }
    // set person info
    this.person = {
      name: name,
      wcaId: wcaId,
      iso2: null,
    };
  }

  async addISO2AndTags() {
    // add country iso2 and add whether PR or not if there is not already a record there or not
    // wcaId can be null, so if they don't have a profile then if it is not a dnf mark as PR
    if (!this.person.wcaId) {
      if (this.average > 0) this.aRT = "PR";
      if (this.best > 0) this.sRT = "PR";
      // take a gamble and assume they are from China
      this.person.iso2 = "CN";
      return;
    }
    // they have WCA ID
    const url = `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${this.person.wcaId}.json`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        "Error fetching person from WCA API",
        personResponse.status
      );
      return;
    }
    const personData = await response.json();

    // add iso2
    this.person.iso2 = personData.country;

    // add PR tag if not already record and is a PR
    const prSingleObj = personData.rank.singles.filter(
      (item) => item.eventId == this.eventId
    )[0];
    this.sRT =
      this.best <= 0
        ? null
        : this.sRT
        ? this.sRT
        : prSingleObj?.best >= this.best
        ? "PR"
        : null;
    const prAverageObj = personData.rank.averages.filter(
      (item) => item.eventId == this.eventId
    )[0];
    this.aRT =
      this.average <= 0
        ? null
        : this.aRT
        ? this.aRT
        : prAverageObj?.best >= this.average
        ? "PR"
        : null;
  }

  createWCALiveResult(
    name,
    wcaId,
    eventId,
    best,
    average,
    attempts,
    sRT,
    aRT,
    iso2,
    link
  ) {
    (this.best = best), (this.average = average);
    (this.sRT = sRT), (this.aRT = aRT);
    this.attempts = attempts.map((attempt) => attempt.result);
    this.eventId = eventId;
    this.person = { name: name, wcaId: wcaId, iso2: iso2 };
    this.link = link;
  }
}

module.exports = ResultObj;
