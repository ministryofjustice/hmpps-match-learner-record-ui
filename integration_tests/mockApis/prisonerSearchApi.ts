import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import prisoners from '../mockData/prisonerByIdData'
import stubPing from './common'
import prisonerList from '../mockData/prisonerListData'

const stubPrisonerApiGetPrisonerById = (id = 'G6115VJ'): SuperAgentRequest => stubFor(prisoners[id])

const stubPrisonerApiPrisonerSearch = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/prisoner-search-api/prisoner-search/match-prisoners',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: prisonerList,
    },
  })

export default {
  stubPrisonerApiGetPrisonerById,
  stubPrisonerApiPrisonerSearch,
  stubPrisonerApiPing: stubPing('prisoner-search-api'),
}
