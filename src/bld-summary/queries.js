const compIdsQuery = (fromDate) => `{
  competitions(from: "${fromDate}"){
    id
    endDate
    competitionEvents{
    	event{
        id
      }
      rounds{
        id
      }
    }
  }
}`;

const roundQuery = (id) => `
  {
  round(id:"${id}"){
      results{
        attempts{
          result
        }
        id
        person{
          name
          country{
            name
            continentName
            iso2
          }
          wcaId
        }
        best
        average
        averageRecordTag
        singleRecordTag
      }
  }
}
`;

module.exports = { compIdsQuery, roundQuery };
