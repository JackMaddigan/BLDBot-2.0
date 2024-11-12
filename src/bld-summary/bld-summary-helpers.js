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

function mbldScoreToInfo(score) {
  const [solved, total] = score.split("/").map((part) => Number(part));
  return {
    solved: solved,
    attempted: total,
    points: solved - (total - solved),
    unsolved: total - solved,
  };
}

module.exports = {
  makeCubingChinaDataToResultObj,
  mbldScoreToInfo,
};
