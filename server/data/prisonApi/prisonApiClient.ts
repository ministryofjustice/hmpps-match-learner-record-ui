import type { ImageDetail } from 'prisonApi'
import config from '../../config'
import RestClient from '../restClient'

export default class PrisonApiClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Prison API', config.apis.prisonApi, token)
  }

  async getPrisonerImageDetails(prisonNumber: string, token: string): Promise<ImageDetail[]> {
    return PrisonApiClient.restClient(token).get<ImageDetail[]>({
      path: `/api/images/offenders/${prisonNumber}`,
    })
  }

  async getImage(imageId: string, token: string) {
    return PrisonApiClient.restClient(token).stream({
      path: `/api/images/${imageId}/data`,
    })
  }
}
