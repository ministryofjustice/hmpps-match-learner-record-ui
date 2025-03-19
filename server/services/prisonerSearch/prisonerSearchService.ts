import type { Prisoner } from 'prisonerApi'
import type { PrisonerSummary } from 'viewModels'
import { HmppsAuthClient } from '../../data'
import PrisonerSearchClient, { PrisonerSearchRequest } from '../../data/prisonerSearch/prisonerSearchClient'
import PrisonerSearchResult from '../../data/prisonerSearch/prisonerSearchResult'
import toPrisonerSummary from '../../data/mappers/prisonerToPrisonerSummaryMapper'

export default class PrisonerSearchService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerSearchClient: PrisonerSearchClient,
  ) {}

  async searchPrisoners(searchString: string, username: string): Promise<PrisonerSearchResult[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken(username)
    const searchArray = searchString.trim().split(' ')
    const nomisRegex = /^[A-Z]\d{4}[A-Z]{2}$/

    if (searchArray.length >= 2) {
      return this.prisonerSearchClient.search(
        {
          firstName: searchArray[0],
          lastName: searchArray.at(-1),
        },
        token,
      )
    }

    if (searchArray.length === 1 && nomisRegex.test(searchArray[0])) {
      return this.prisonerSearchClient.search({ prisonerIdentifier: searchArray[0] }, token)
    }

    const results: PrisonerSearchResult[] = [
      ...(await this.prisonerSearchClient.search({ firstName: searchArray[0] }, token)),
      ...(await this.prisonerSearchClient.search({ lastName: searchArray[0] }, token)),
    ]

    return results
  }

  async getPrisonerByPrisonNumber(prisonNumber: string, username: string): Promise<PrisonerSummary> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const prisoner: Prisoner = await this.prisonerSearchClient.getPrisonerByPrisonNumber(prisonNumber, systemToken)
    return toPrisonerSummary(prisoner)
  }
}
