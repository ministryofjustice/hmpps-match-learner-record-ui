import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import prisoners from '../mockData/prisonerByIdData'
import stubPing from './common'
import prisonerList from '../mockData/prisonerListData'

const getPrisonerById = (id = 'G6115VJ'): SuperAgentRequest => stubFor(prisoners[id])

const stubPrisonerSearch = (searchString: string = 'John Smith'): SuperAgentRequest =>
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
  getPrisonerById,
  stubPrisonerSearch,
  stubPrisonerSearchApiPing: stubPing('prisoner-search-api'),
}
