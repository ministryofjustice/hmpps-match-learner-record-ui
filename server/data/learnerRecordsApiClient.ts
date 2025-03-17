import type {
  LearnerEventsRequest,
  LearnerEventsResponse,
  LearnerSearchByDemographic,
  LearnersResponse,
  ConfirmMatchRequest,
} from 'learnerRecordsApi'
import config from '../config'
import RestClient from './restClient'

export default class LearnerRecordsApiClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Learner Records API', config.apis.learnerRecordsApi, token)
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
    learnerEventsRequest: LearnerEventsRequest,
    username: string,
    token: string,
  ): Promise<LearnerEventsResponse> {
    return LearnerRecordsApiClient.restClient(token).post<LearnerEventsResponse>({
      path: '/learner-events',
      data: {
        ...learnerEventsRequest,
      },
      headers: {
        'X-Username': username,
      },
    })
  }

  async confirmMatch(
    prisonerNumber: string,
    confirmMatchRequest: ConfirmMatchRequest,
    username: string,
    token: string,
  ): Promise<void> {
    return LearnerRecordsApiClient.restClient(token).post<void>({
      path: `/match/${prisonerNumber}`,
      data: {
        ...confirmMatchRequest,
      },
      headers: {
        'X-Username': username,
      },
    })
  }
}
