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
      return [
        {
          firstName: 'John',
          lastName: 'Smith',
          prisonerNumber: 'A1234AA',
          nationality: 'English',
          prisonId: '',
          prisonName: '',
          cellLocation: '',
          pncNumber: '',
          croNumber: '',
          dateOfBirth: undefined,
          mostSeriousOffence: '',
          category: '',
          sentenceExpiryDate: undefined,
          licenceExpiryDate: undefined,
          paroleEligibilityDate: undefined,
          homeDetentionCurfewEligibilityDate: undefined,
          releaseDate: undefined,
          restrictedPatient: false,
          locationDescription: '',
          lastMovementTypeCode: '',
          lastMovementReasonCode: '',
          indeterminateSentence: false,
          recall: false,
          conditionalReleaseDate: undefined,
        },
        {
          firstName: 'Ben',
          lastName: 'Person',
          prisonerNumber: 'A1234DA',
          nationality: 'Spanish',
          prisonId: '',
          prisonName: '',
          cellLocation: '',
          pncNumber: '',
          croNumber: '',
          dateOfBirth: undefined,
          mostSeriousOffence: '',
          category: '',
          sentenceExpiryDate: undefined,
          licenceExpiryDate: undefined,
          paroleEligibilityDate: undefined,
          homeDetentionCurfewEligibilityDate: undefined,
          releaseDate: undefined,
          restrictedPatient: false,
          locationDescription: '',
          lastMovementTypeCode: '',
          lastMovementReasonCode: '',
          indeterminateSentence: false,
          recall: false,
          conditionalReleaseDate: undefined,
        },
        {
          firstName: 'Lyle',
          lastName: 'Someone',
          prisonerNumber: 'B1234AA',
          nationality: 'English',
          prisonId: '',
          prisonName: '',
          cellLocation: '',
          pncNumber: '',
          croNumber: '',
          dateOfBirth: undefined,
          mostSeriousOffence: '',
          category: '',
          sentenceExpiryDate: undefined,
          licenceExpiryDate: undefined,
          paroleEligibilityDate: undefined,
          homeDetentionCurfewEligibilityDate: undefined,
          releaseDate: undefined,
          restrictedPatient: false,
          locationDescription: '',
          lastMovementTypeCode: '',
          lastMovementReasonCode: '',
          indeterminateSentence: false,
          recall: false,
          conditionalReleaseDate: undefined,
        },
        {
          firstName: 'Gale',
          lastName: 'Jones',
          prisonerNumber: 'A1234RG',
          nationality: 'Welsh',
          prisonId: '',
          prisonName: '',
          cellLocation: '',
          pncNumber: '',
          croNumber: '',
          dateOfBirth: undefined,
          mostSeriousOffence: '',
          category: '',
          sentenceExpiryDate: undefined,
          licenceExpiryDate: undefined,
          paroleEligibilityDate: undefined,
          homeDetentionCurfewEligibilityDate: undefined,
          releaseDate: undefined,
          restrictedPatient: false,
          locationDescription: '',
          lastMovementTypeCode: '',
          lastMovementReasonCode: '',
          indeterminateSentence: false,
          recall: false,
          conditionalReleaseDate: undefined,
        },
        {
          firstName: 'Micheal',
          lastName: 'Campbell',
          prisonerNumber: 'G1234HA',
          nationality: 'French',
          prisonId: '',
          prisonName: '',
          cellLocation: '',
          pncNumber: '',
          croNumber: '',
          dateOfBirth: undefined,
          mostSeriousOffence: '',
          category: '',
          sentenceExpiryDate: undefined,
          licenceExpiryDate: undefined,
          paroleEligibilityDate: undefined,
          homeDetentionCurfewEligibilityDate: undefined,
          releaseDate: undefined,
          restrictedPatient: false,
          locationDescription: '',
          lastMovementTypeCode: '',
          lastMovementReasonCode: '',
          indeterminateSentence: false,
          recall: false,
          conditionalReleaseDate: undefined,
        },
      ]
    }
  }
}
