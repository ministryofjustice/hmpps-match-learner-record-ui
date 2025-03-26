import { Request, Response } from 'express'
import type { PrisonerSummary } from 'viewModels'
import type {
  LearnerEventsResponse,
  LearnerRecord,
  LearnerSearchByDemographic,
  LearnersResponse,
} from 'learnerRecordsApi'
import validateSearchByInformationForm from './searchByInformationValidator'
import AuditService, { Page } from '../../services/auditService'
import SearchForLearnerRecordController from './searchForLearnerRecordController'
import validateSearchByUlnForm from './searchByUlnValidator'
import LearnerRecordsService from '../../services/learnerRecordsService'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'

jest.mock('../../services/auditService')
jest.mock('./searchByInformationValidator')
jest.mock('./searchByUlnValidator')
jest.mock('../../services/learnerRecordsService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')
jest.mock('../../services/learnerRecordsService')

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
    id: '123',
    session: {},
    params: {
      prisonerNumber: 'A123456',
    },
    body: {
      givenName: 'John',
      familyName: 'Doe',
      'dob-day': '01',
      'dob-month': '01',
      'dob-year': '1950',
      postcode: 'ZZ99 9ZZ',
      sex: 'NOT_KNOWN',
    },
    query: {},
    user: { username: 'test-user' },
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: {},
  } as unknown as Response

  const learnerSearchByDemographic: LearnerSearchByDemographic = { familyName: '', givenName: '' }
  const learnerRecord: LearnerRecord = {
    abilityToShare: '',
    createdDate: '',
    dateOfAddressCapture: '',
    dateOfBirth: '',
    emailAddress: '',
    familyName: '',
    familyNameAtAge16: '',
    gender: '',
    givenName: '',
    lastKnownAddressCountyOrCity: '',
    lastKnownAddressLine1: '',
    lastKnownAddressTown: '',
    lastKnownPostCode: '',
    lastUpdatedDate: '',
    learnerStatus: '',
    middleOtherName: '',
    placeOfBirth: '',
    preferredGivenName: '',
    previousFamilyName: '',
    schoolAtAge16: '',
    scottishCandidateNumber: '',
    tierLevel: '',
    title: '',
    uln: '',
    verificationType: '',
    versionNumber: '',
  }

  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    errors = []
  })

  describe('getSearchForLearnerRecordViewByUln', () => {
    it('should get search for learner record view by uln page', async () => {
      await controller.getSearchForLearnerRecordViewByUln(req, res, next)
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH_BY_ULN_PAGE, {
        who: req.user.username,
        correlationId: req.id,
      })
      expect(res.render).toHaveBeenCalledWith('pages/searchForLearnerRecord/byUln', {})
    })
  })

  describe('getSearchForLearnerRecordViewByInformation', () => {
    it('should get search for learner record view by information page', async () => {
      await controller.getSearchForLearnerRecordViewByInformation(req, res, next)
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH_BY_INFORMATION_PAGE, {
        who: req.user.username,
        correlationId: req.id,
      })
      expect(res.render).toHaveBeenCalledWith('pages/searchForLearnerRecord/byInformation', {})
    })
  })

  describe('postSearchForLearnerRecordByInformation', () => {
    it('should redirect to the same page if errors are present', async () => {
      errors = [{ href: '#givenName', text: 'some-error' }]
      mockedSearchByInformationValidator.mockReturnValue(errors)
      req.params.prisonNumber = '12AS354'

      await controller.postSearchForLearnerRecordByInformation(req, res, next)

      expect(auditService.logAuditEvent).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/search-for-learner-record-by-information/${req.params.prisonNumber}`,
        errors,
      )
    })

    it('should redirect to the learner search results on valid submission', async () => {
      const learnerSearchByDemographicBody: LearnerSearchByDemographic = {
        familyName: 'Doe',
        givenName: 'John',
        dateOfBirth: '1950-01-01',
      }
      mockedSearchByInformationValidator.mockReturnValue([])
      learnerRecordsService.getLearnersByDemographicDetails.mockResolvedValue({
        searchParameters: learnerSearchByDemographicBody,
        responseType: 'Match Found',
        matchedLearners: [learnerRecord],
      })
      await controller.postSearchForLearnerRecordByInformation(req, res, next)

      expect(auditService.logAuditEvent).toHaveBeenCalledWith({
        what: 'SEARCH_FOR_LEARNER_RECORD',
        who: req.user.username,
        correlationId: req.id,
        subjectId: req.params.prisonNumber,
        subjectType: 'Prison Number',
        details: {
          searchParameters: {
            gender: 'NOT_KNOWN',
            lastKnownPostCode: 'ZZ99 9ZZ',
            ...learnerSearchByDemographicBody,
          },
          responseType: 'Match Found',
        },
      })
      expect(res.redirect).toHaveBeenCalledWith(`/learner-search-results/${req.params.prisonNumber}`)
    })

    it('should redirect to too-many-results page if too many results response is received from LRS', async () => {
      const responseType = 'Too Many Matches'
      const learnersResponse: LearnersResponse = {
        searchParameters: learnerSearchByDemographic,
        responseType,
        matchedLearners: [learnerRecord, learnerRecord],
      }
      learnerRecordsService.getLearnersByDemographicDetails.mockResolvedValue(learnersResponse)
      mockedSearchByInformationValidator.mockReturnValue([])
      await controller.postSearchForLearnerRecordByInformation(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(`/too-many-results/${req.params.prisonNumber}`)
    })

    it('should redirect to no-match-found page if no match returned from LRS', async () => {
      const responseType = 'No Match'
      const learnersResponse: LearnersResponse = {
        searchParameters: learnerSearchByDemographic,
        responseType,
        matchedLearners: [learnerRecord, learnerRecord],
      }
      learnerRecordsService.getLearnersByDemographicDetails.mockResolvedValue(learnersResponse)
      mockedSearchByInformationValidator.mockReturnValue([])
      await controller.postSearchForLearnerRecordByInformation(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(`/no-match-found/${req.params.prisonNumber}`)
    })
  })

  describe('postSearchForLearnerRecordByUln', () => {
    it('should redirect to the same page if errors are present', async () => {
      errors = [{ href: '#uln', text: 'some-error' }]
      mockedSearchByUlnValidator.mockReturnValue(errors)
      req.params.prisonNumber = '12AS354'

      await controller.postSearchForLearnerRecordByUln(req, res, next)

      expect(auditService.logAuditEvent).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/search-for-learner-record-by-uln/${req.params.prisonNumber}`,
        errors,
      )
    })

    it('should successfully redirect the view Record page on valid submission', async () => {
      req.body.uln = '1234567890'
      const prisoner = {
        prisonerNumber: 'A1234BC',
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: new Date(),
      } as PrisonerSummary

      res.locals.prisonerSummary = prisoner

      mockedSearchByUlnValidator.mockReturnValue([])
      learnerRecordsService.getLearnerEvents.mockResolvedValue({ learnerRecord: [] } as LearnerEventsResponse)

      await controller.postSearchForLearnerRecordByUln(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/view-record/${req.params.prisonNumber}/${req.body.uln}`)
    })
  })
})
