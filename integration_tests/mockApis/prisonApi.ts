import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import stubPing from './common'

const stubPrisonApiPrisonerImage = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prison-api/api/images/offenders/.*',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [],
    },
  })

const stubPrisonApiPrisonerImage500Response = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prison-api/api/images/offenders/.*',
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: 'string',
        userMessage: 'string',
        developerMessage: 'string',
        moreInfo: 'string',
      },
    },
  })

export default {
  stubPrisonApiPrisonerImage,
  stubPrisonApiPrisonerImage500Response,
  stubPrisonApiPing: stubPing('prison-api'),
}
