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

const recentRecordsQuery = `{
  recentRecords{
    result{
     attempts{
        result
      }
      enteredAt
      person{
        avatar{
					thumbUrl
      	}
        name
        competition{
          id
        }
        wcaId
        country{
          iso2
          name
        }
      }
      round{
        id
        competitionEvent{
          event{
            id
          }
        }
      }
    }
    attemptResult
    type
    tag
    id
  }
}`;

module.exports = { compIdsQuery, roundQuery, recentRecordsQuery };
