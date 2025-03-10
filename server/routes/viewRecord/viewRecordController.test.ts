import { Request, Response } from 'express'
import ViewRecordController from './viewRecordController'

jest.mock('../../services/auditService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')

describe('ViewRecordController', () => {
  const controller = new ViewRecordController()
  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
  } as unknown as Response

  describe('getViewRecord', () => {
    it('should render the problem page', async () => {
      await controller.getViewRecord(req, res, null)
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord')
    })
  })
})
