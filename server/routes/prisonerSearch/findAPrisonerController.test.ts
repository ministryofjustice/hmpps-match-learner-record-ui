import { Request, Response } from 'express'
import type { CheckMatchResponse } from 'learnerRecordsApi'
import FindAPrisonerController from './findAPrisonerController'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'
import AuditService, { Page } from '../../services/auditService'
import PrisonerSearchResult from '../../data/prisonerSearch/prisonerSearchResult'
import validateFindAPrisonerForm from './findAPrisonerValidator'
import LearnerRecordsService from '../../services/learnerRecordsService'

jest.mock('../../services/auditService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')
jest.mock('../../services/learnerRecordsService')
jest.mock('./findAPrisonerValidator')

describe('FindPrisonerController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const prisonerSearchService = new PrisonerSearchService(null, null) as jest.Mocked<PrisonerSearchService>
  const learnerRecordsService = new LearnerRecordsService(null, null) as jest.Mocked<LearnerRecordsService>
  const controller = new FindAPrisonerController(auditService, prisonerSearchService, learnerRecordsService)
  const mockedFindAPrisonerValidator = validateFindAPrisonerForm as jest.MockedFn<typeof validateFindAPrisonerForm>
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
    redirectWithErrors: jest.fn(),
    status: jest.fn(),
    locals: { user: { username: 'test-user' } },
  } as unknown as Response

  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getFindPrisonerView', () => {
    it('should render the find prisoner page', async () => {
      auditService.logPageView.mockResolvedValue(null)
      req.session.searchResults = { data: [], search: '' }

      await controller.getFindAPrisoner(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/findAPrisoner/index', { data: [], search: '' })
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

      const checkResponse: CheckMatchResponse = {
        matchedUln: '1234567890',
        status: 'Found',
      }

      prisonerSearchService.searchPrisoners.mockResolvedValue(prisoners)
      learnerRecordsService.checkMatch.mockResolvedValue(checkResponse)
      mockedFindAPrisonerValidator.mockReturnValue([])

      req.body.search = 'Example Person'

      await controller.postFindAPrisoner(req, res, next)

      const expectedData = [
        {
          firstName: 'Example',
          prisonerNumber: '',
          lastName: 'Person',
          prisonId: '',
          prisonName: '',
          cellLocation: '',
          nationality: '',
          matchedUln: '1234567890',
        },
      ]

      expect(res.render).toHaveBeenCalledWith('pages/findAPrisoner/index', {
        data: expectedData,
        search: 'Example Person',
      })
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.PRISONER_SEARCH_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
    })

    it('should pass errors to middleware for handling', async () => {
      const error = new Error('Search failed')
      prisonerSearchService.searchPrisoners.mockRejectedValue(new Error('Search failed'))
      mockedFindAPrisonerValidator.mockReturnValue([])
      req.body.search = 'Example Person'
      await controller.postFindAPrisoner(req, res, next)
      expect(next).toHaveBeenCalledWith(error)
    })

    it('should redirect to the same page if errors are present', async () => {
      const errors = [{ href: '#search', text: 'some-error' }]
      mockedFindAPrisonerValidator.mockReturnValue(errors)

      await controller.postFindAPrisoner(req, res, next)

      expect(res.redirectWithErrors).toHaveBeenCalledWith('/find-a-prisoner', errors)
    })
  })
})
