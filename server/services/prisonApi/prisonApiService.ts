import type { ImageDetail } from 'prisonApi'
import { Readable } from 'stream'
import { HmppsAuthClient } from '../../data'
import PrisonApiClient from '../../data/prisonApi/prisonApiClient'

export default class PrisonApiService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonApiClient: PrisonApiClient,
  ) {}

  async getPrisonerImageData(prisonNumber: string, username: string): Promise<ImageDetail[]> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const imageData = await this.prisonApiClient.getPrisonerImageDetails(prisonNumber, systemToken)
    return imageData
  }

  async getImage(imageId: string, username: string): Promise<Readable> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const image = await this.prisonApiClient.getImage(imageId, systemToken)
    return image
  }
}
