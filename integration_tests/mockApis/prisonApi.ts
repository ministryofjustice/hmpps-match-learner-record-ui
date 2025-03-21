import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import prisoners from '../mockData/prisonerByIdData'
import stubPing from './common'

const getPrisonerById = (id = 'G6115VJ'): SuperAgentRequest => stubFor(prisoners[id])

const stubPrisonerImage = (): SuperAgentRequest =>
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

export default {
  getPrisonerById,
  stubPrisonerImage,
  stubPrisonApiPing: stubPing('prison-api'),
}
