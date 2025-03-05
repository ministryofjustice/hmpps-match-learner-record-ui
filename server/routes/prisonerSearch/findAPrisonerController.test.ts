import { Request, Response } from 'express'
import FindAPrisonerController from './findAPrisonerController'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'
import AuditService, { Page } from '../../services/auditService'
import PrisonerSearchResult from '../../data/prisonerSearch/prisonerSearchResult'

jest.mock('../../services/auditService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')

describe('FindPrisonerController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const prisonerSearchService = new PrisonerSearchService(null, null) as jest.Mocked<PrisonerSearchService>
  const controller = new FindAPrisonerController(auditService, prisonerSearchService)
  auditService.logPageView = jest.fn()

  const req = {
    session: {},
    body: {},
    query: {},
    user: { username: 'test-user' },
  } as unknown as Request

  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: { user: { username: 'test-user' } },
  } as unknown as Response

  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getFindPrisonerView', () => {
    it('should render the find prisoner page', async () => {
      auditService.logPageView.mockResolvedValue(null)

      await controller.getFindAPrisoner(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/findAPrisoner')
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.PRISONER_SEARCH_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
    })
  })

  describe('postFindPrisoner', () => {
    it('should render the find prisoner page with search results', async () => {
      const prisoners: PrisonerSearchResult[] = [
        {
          firstName: 'Example',
          prisonerNumber: '',
          lastName: 'Person',
          prisonId: '',
          prisonName: '',
          cellLocation: '',
          dateOfBirth: undefined,
          nationality: '',
        },
      ]

      prisonerSearchService.searchPrisoners.mockResolvedValue(prisoners)

      await controller.postFindAPrisoner(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/findAPrisoner', { data: prisoners })
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.PRISONER_SEARCH_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
    })

    it('should redirect with 500 if search fails', async () => {
      prisonerSearchService.searchPrisoners.mockRejectedValue(new Error('Search failed'))
      await controller.postFindAPrisoner(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(500, '/find-a-prisoner')
    })
  })
})
