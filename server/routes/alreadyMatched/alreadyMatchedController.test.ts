import { Request, Response } from 'express'
import AlreadyMatchedController from './alreadyMatchedController'
import AuditService from '../../services/auditService'

jest.mock('../../services/auditService')

describe('AlreadyMatchedController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new AlreadyMatchedController(auditService)

  const req = {
    session: {
      returnTo: '/',
    },
    params: {
      prisonerNumber: 'A123456',
      uln: '1234',
    },
    body: {},
    query: {},
    user: { username: 'test-user' },
  } as unknown as Request

  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    status: jest.fn(),
    locals: { user: { username: 'test-user' } },
  } as unknown as Response

  const next = jest.fn()

  describe('getAlreadyMatchedView', () => {
    it('should render the already matched page', async () => {
      await controller.getAlreadyMatched(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/matchConfirmed/alreadyMatched', {
        prisonerNumber: 'A123456',
        uln: '1234',
        backBase: '/',
      })
    })
  })
})
