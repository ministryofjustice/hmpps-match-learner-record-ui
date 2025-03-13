import { Request, Response } from 'express'
import FindAPrisonerController from './findAPrisonerController'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'
import AuditService, { Page } from '../../services/auditService'
import PrisonerSearchResult from '../../data/prisonerSearch/prisonerSearchResult'
import validateFindAPrisonerForm from './findAPrisonerValidator'
import PrisonApiService from '../../services/prisonApi/prisonApiService'

jest.mock('../../services/auditService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')
jest.mock('../../services/prisonApi/prisonApiService')
jest.mock('./findAPrisonerValidator')

describe('FindPrisonerController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const prisonerSearchService = new PrisonerSearchService(null, null) as jest.Mocked<PrisonerSearchService>
  const prisonApiService = new PrisonApiService(null, null) as jest.Mocked<PrisonApiService>
  const controller = new FindAPrisonerController(auditService, prisonerSearchService, prisonApiService)
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

      await controller.getFindAPrisoner(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/findAPrisoner/index', { search: '' })
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.PRISONER_SEARCH_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
    })
  })

  describe('postFindPrisoner', () => {
    it('should render the find prisoner page with search results', async () => {
      const prisonerResult: PrisonerSearchResult = {
        firstName: 'Example',
        prisonerNumber: '',
        lastName: 'Person',
        prisonId: '',
        prisonName: '',
        cellLocation: '',
        dateOfBirth: undefined,
        nationality: '',
      }
      const prisoners: PrisonerSearchResult[] = [prisonerResult]
      const modifiedPrisoner = {
        ...prisonerResult,
        age: undefined as string,
        imageId: 'placeholder',
      }

      prisonerSearchService.searchPrisoners.mockResolvedValue(prisoners)
      prisonApiService.getPrisonerImageData.mockResolvedValue([])
      mockedFindAPrisonerValidator.mockReturnValue([])

      req.body.search = 'Example Person'

      await controller.postFindAPrisoner(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/findAPrisoner/index', {
        data: [modifiedPrisoner],
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
