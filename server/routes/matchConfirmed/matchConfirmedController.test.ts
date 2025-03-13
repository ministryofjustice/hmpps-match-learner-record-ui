import { Request, Response } from 'express'
import AuditService, { Page } from '../../services/auditService'
import MatchConfirmedController from './matchConfirmedController'

jest.mock('../../services/auditService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')

describe('FindPrisonerController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new MatchConfirmedController(auditService)
  auditService.logPageView = jest.fn()

  const req = {
    session: {},
    body: {},
    params: { uln: '1234567890', prisonerNumber: 'A1234BC' },
    query: {},
    user: { username: 'test-user' },
  } as unknown as Request

  const res = {
    render: jest.fn(),
    locals: { user: { username: 'test-user' } },
  } as unknown as Response

  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getMatchConfirmed', () => {
    it('should render the find match confirmed page', async () => {
      auditService.logPageView.mockResolvedValue(null)
      await controller.getMatchConfirmed(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/matchConfirmed/confirmedPage', {
        firstName: undefined,
        lastName: undefined,
        uln: '1234567890',
        prisonerNumber: 'A1234BC',
      })
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.MATCH_CONFIRMED_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
    })
  })
})
