import type { Prisoner } from 'prisonerApi'
import { HmppsAuthClient } from '../../data'
import PrisonerSearchClient, { PrisonerSearchRequest } from '../../data/prisonerSearch/prisonerSearchClient'
import PrisonerSearchResult from '../../data/prisonerSearch/prisonerSearchResult'

export default class PrisonerSearchService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerSearchClient: PrisonerSearchClient,
  ) {}

  async searchPrisoners(searchString: string, username: string): Promise<PrisonerSearchResult[]> {
    const searchArray = searchString.trim().split(' ')
    let requestObject: PrisonerSearchRequest

    if (searchArray.length >= 2) {
      requestObject = {
        firstName: searchArray[0],
        lastName: searchArray.at(-1),
      }
    } else {
      requestObject = {
        prisonerIdentifier: searchArray[0],
      }
    }

    const token = await this.hmppsAuthClient.getSystemClientToken(username)
    return this.prisonerSearchClient.search(requestObject, token)
  }

  async getPrisonerByPrisonNumber(prisonNumber: string, username: string): Promise<Prisoner> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const prisoner: Prisoner = await this.prisonerSearchClient.getPrisonerByPrisonNumber(prisonNumber, systemToken)
    return prisoner
  }
}
