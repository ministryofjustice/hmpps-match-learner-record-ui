import { Request, Response } from 'express'
import ThereIsAProblemController from './thereIsAProblem'

jest.mock('../../services/auditService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')

describe('FindPrisonerController', () => {
  const controller = new ThereIsAProblemController()
  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
  } as unknown as Response

  describe('getThereIsAProblem', () => {
    it('should render the problem page', async () => {
      await controller.getThereIsAProblem(req, res, null)
      expect(res.render).toHaveBeenCalledWith('pages/thereIsAProblem')
    })
  })
})
