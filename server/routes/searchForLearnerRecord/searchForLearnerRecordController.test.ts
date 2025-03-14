import { Request, Response } from 'express'
import type { PrisonerSummary } from 'viewModels'
import type { LearnerEventsResponse } from 'learnerRecordsApi'
import validateSearchByInformationForm from './searchByInformationValidator'
import AuditService from '../../services/auditService'
import SearchForLearnerRecordController from './searchForLearnerRecordController'
import validateSearchByUlnForm from './searchByUlnValidator'
import LearnerRecordsService from '../../services/learnerRecordsService'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'

jest.mock('../../services/auditService')
jest.mock('./searchByInformationValidator')
jest.mock('./searchByUlnValidator')
jest.mock('../../services/learnerRecordsService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')

describe('searchForLearnerRecordController', () => {
  const mockedSearchByInformationValidator = validateSearchByInformationForm as jest.MockedFn<
    typeof validateSearchByInformationForm
  >
  const mockedSearchByUlnValidator = validateSearchByUlnForm as jest.MockedFn<typeof validateSearchByUlnForm>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const learnerRecordsService = new LearnerRecordsService(null, null) as jest.Mocked<LearnerRecordsService>
  const prisonerSearchService = new PrisonerSearchService(null, null) as jest.Mocked<PrisonerSearchService>
  const controller = new SearchForLearnerRecordController(auditService, learnerRecordsService, prisonerSearchService)

  const req = {
    session: {},
    body: {},
    query: {},
    params: {},
    user: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    errors = []
  })

  describe('getSearchForLearnerRecordViewByUln', () => {
    it('should get search for learner record view by uln page', async () => {
      await controller.getSearchForLearnerRecordViewByUln(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/searchForLearnerRecord/byUln', {})
    })
  })

  describe('getSearchForLearnerRecordViewByInformation', () => {
    it('should get search for learner record view by information page', async () => {
      await controller.getSearchForLearnerRecordViewByInformation(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/searchForLearnerRecord/byInformation', {})
    })
  })

  describe('postSearchForLearnerRecordByInformation', () => {
    it('should redirect to the same page if errors are present', async () => {
      errors = [{ href: '#givenName', text: 'some-error' }]
      mockedSearchByInformationValidator.mockReturnValue(errors)
      req.params.prisonNumber = '12AS354'

      await controller.postSearchForLearnerRecordByInformation(req, res, next)

      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/search-for-learner-record-by-information/${req.params.prisonNumber}`,
        errors,
      )
    })
  })

  describe('postSearchForLearnerRecordByUln', () => {
    it('should redirect to the same page if errors are present', async () => {
      errors = [{ href: '#uln', text: 'some-error' }]
      mockedSearchByUlnValidator.mockReturnValue(errors)
      req.params.prisonNumber = '12AS354'

      await controller.postSearchForLearnerRecordByUln(req, res, next)

      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/search-for-learner-record-by-uln/${req.params.prisonNumber}`,
        errors,
      )
    })
  })

  it('should render the view Record page', async () => {
    req.body.uln = '1234567890'
    const prisoner = {
      prisonerNumber: 'A1234BC',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new Date(),
    } as PrisonerSummary
    mockedSearchByUlnValidator.mockReturnValue([])
    prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(prisoner)
    learnerRecordsService.getLearnerEvents.mockResolvedValue({ learnerRecord: [] } as LearnerEventsResponse)
    await controller.postSearchForLearnerRecordByUln(req, res, null)
    expect(res.render).toHaveBeenCalledWith('pages/viewRecord/recordPage', {
      learner: {
        uln: req.body.uln,
        givenName: prisoner.firstName,
        familyName: prisoner.lastName,
        dateOfBirth: prisoner.dateOfBirth.toISOString().slice(0, 10),
      },
      learnerEvents: [],
      prisoner,
      backBase: '/search-for-learner-record-by-uln/',
    })
  })
})
