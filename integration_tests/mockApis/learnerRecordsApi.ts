import { SuperAgentRequest } from 'superagent'
import stubPing from './common'
import { stubFor } from './wiremock'

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

export default {
  stubNoMatchForAll,
  stubLearnerRecordsHealth: stubPing(),
}
