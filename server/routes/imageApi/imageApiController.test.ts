import { Request, Response } from 'express'
import { Readable } from 'stream'
import ImageApiController from './imageApiController'
import PrisonApiService from '../../services/prisonApi/prisonApiService'
import AuditService from '../../services/auditService'

jest.mock('../../services/prisonApi/prisonApiService')
jest.mock('../../services/auditService')

describe('ImageApiController', () => {
  const prisonApiService = new PrisonApiService(null, null) as jest.Mocked<PrisonApiService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ImageApiController(auditService, prisonApiService)

  const req = {
    params: {},
  } as unknown as Request
  const res = {
    set: jest.fn(),
    sendFile: jest.fn(),
    removeHeader: jest.fn(),
    type: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('prisonerImage', () => {
    it('should return placeholder image when imageId is "placeholder"', async () => {
      req.params.imageId = 'placeholder'
      await controller.prisonerImage(req, res, next)
      expect(res.sendFile).toHaveBeenCalledWith(expect.stringContaining('prisoner-profile-image'))
    })

    it('should return image from prisonApiService when imageId is valid', async () => {
      req.params.imageId = '123'
      const data = { pipe: jest.fn() } as unknown as Readable
      prisonApiService.getImage.mockResolvedValue(data)
      await controller.prisonerImage(req, res, next)
      expect(prisonApiService.getImage).toHaveBeenCalledWith('123', 'default-username')
      expect(res.set).toHaveBeenCalledWith('Cache-control', 'private, max-age=86400')
      expect(res.removeHeader).toHaveBeenCalledWith('pragma')
      expect(res.type).toHaveBeenCalledWith('image/jpeg')
      expect(data.pipe).toHaveBeenCalledWith(res)
    })
  })
})
