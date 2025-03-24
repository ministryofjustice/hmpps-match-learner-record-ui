import { SuperAgentRequest } from 'superagent'
import stubPing from './common'
import { stubFor } from './wiremock'
import learnerEvents from '../mockData/learnerEvents'

const stubNoMatchForAll = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/match/.*',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        matchedUln: '',
        givenName: '',
        familyName: '',
        status: 'NoMatch',
      },
    },
  })

const stubLearnerRecordExactMatch = (
  givenName: string = 'Darcie',
  familyName: string = 'Tucker',
  uln: string = '1026893096',
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/learner-events',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        searchParameters: { givenName, familyName, uln },
        responseType: 'Exact Match',
        foundUln: uln,
        incomingUln: uln,
        learnerRecord: [...learnerEvents],
      },
    },
  })

export default {
  stubNoMatchForAll,
  stubLearnerRecordExactMatch,
  stubLearnerRecordsHealth: stubPing(),
}
