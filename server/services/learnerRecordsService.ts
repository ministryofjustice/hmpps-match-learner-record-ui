import type {
  LearnerEventsRequest,
  LearnerEventsResponse,
  LearnerSearchByDemographic,
  LearnersResponse,
} from 'learnerRecordsApi'
import { HmppsAuthClient } from '../data'
import LearnerRecordsApiClient from '../data/learnerRecordsApiClient'

export default class LearnerRecordsService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly learnerRecordsApiClient: LearnerRecordsApiClient,
  ) {}

  async getLearnersByDemographicDetails(
    demographicDetails: LearnerSearchByDemographic,
    username: string,
  ): Promise<LearnersResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken(username)
    return this.learnerRecordsApiClient.getLearners(demographicDetails, username, token)
  }

  async getLearnerEvents(learnerEventsRequest: LearnerEventsRequest, username: string): Promise<LearnerEventsResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken(username)
    return this.learnerRecordsApiClient.getLearnerEvents(learnerEventsRequest, username, token)
  }
}
