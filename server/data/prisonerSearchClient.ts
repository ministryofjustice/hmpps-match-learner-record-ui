import { plainToInstance } from 'class-transformer'
import config from '../config'
import RestClient from './restClient'
import PrisonerSearchResult from './prisonerSearchResult'

export interface PrisonerSearchByPrisonerNumber {
  prisonerIdentifier: string
  prisonIds?: string[]
  includeAliases?: boolean
}

export interface PrisonerSearchByName {
  firstName: string
  lastName: string
  prisonIds?: string[]
  includeAliases?: boolean
}

export type PrisonerSearchRequest = PrisonerSearchByPrisonerNumber | PrisonerSearchByName

export default class PrisonerSearchClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Prisoner Search', config.apis.prisonerSearch, token)
  }

  async search(searchRequest: PrisonerSearchRequest, token: string): Promise<PrisonerSearchResult[]> {
    try {
      const results = await PrisonerSearchClient.restClient(token).post<PrisonerSearchResult[]>({
        path: `/prisoner-search/match-prisoners`,
        data: {
          includeAliases: false,
          ...searchRequest,
        },
      })
      return results.map(result => plainToInstance(PrisonerSearchResult, result, { excludeExtraneousValues: true }))
    } catch {
      throw new Error('Error communicating with the Prisoner Search API')
    }
  }
}
