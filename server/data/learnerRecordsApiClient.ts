import type {
  LearnerEventsRequest,
  LearnerEventsResponse,
  LearnerSearchByDemographic,
  LearnersResponse,
} from 'learnerRecordsApi'
import config from '../config'
import RestClient from './restClient'

export default class LearnerRecordsApiClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Prisoner Search', config.apis.learnerRecordsApi, token)
  }

  async getLearners(
    demographicDetails: LearnerSearchByDemographic,
    username: string,
    token: string,
  ): Promise<LearnersResponse> {
    return LearnerRecordsApiClient.restClient(token).post<LearnersResponse>({
      path: '/learners',
      data: {
        ...demographicDetails,
      },
      headers: {
        'X-Username': username,
      },
    })
  }

  async getLearnerEvents(
    LearnerEventsRequest: LearnerEventsRequest,
    username: string,
    token: string,
  ): Promise<LearnerEventsResponse> {
    return LearnerRecordsApiClient.restClient(token).post<LearnerEventsResponse>({
      path: '/learner-events',
      data: {
        ...LearnerEventsRequest,
      },
      headers: {
        'X-Username': username,
      },
    })
  }
}
