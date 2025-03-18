import 'reflect-metadata'
import nock from 'nock'
import type { ImageDetail } from 'prisonApi'
import config from '../../config'
import PrisonSearchClient from './prisonApiClient'

describe('prisonApiClient', () => {
  let fakePrisonApi: nock.Scope
  let client: PrisonSearchClient

  const token = 'token-1'

  beforeEach(() => {
    fakePrisonApi = nock(config.apis.prisonApi.url)
    client = new PrisonSearchClient()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('get prisoner image details', async () => {
    const results: ImageDetail[] = [
      {
        imageId: '2461788',
        active: false,
        captureDate: '2008-08-27',
        captureDateTime: '2021-07-05T10:35:17',
        imageView: 'FACE',
        imageOrientation: 'FRONT',
        imageType: 'OFF_BKG',
      },
    ]
    const testNumber = 'A1111BC'
    fakePrisonApi
      .get(`/api/images/offenders/${testNumber}`)
      .matchHeader('authorization', `Bearer ${token}`)
      .reply(200, results)

    const output = await client.getPrisonerImageDetails(testNumber, token)

    expect(output).toEqual(results)
  })
})
