import { Request, Response } from 'express'
import type { LearnerRecord, LearnerSearchByDemographic, LearnersResponse } from 'learnerRecordsApi'
import validateSearchByInformationForm from './searchByInformationValidator'
import AuditService from '../../services/auditService'
import SearchForLearnerRecordController from './searchForLearnerRecordController'
import validateSearchByUlnForm from './searchByUlnValidator'
import LearnerRecordsService from '../../services/learnerRecordsService'

jest.mock('../../services/auditService')
jest.mock('./searchByInformationValidator')
jest.mock('./searchByUlnValidator')
jest.mock('../../services/learnerRecordsService')

describe('searchForLearnerRecordController', () => {
  const mockedSearchByInformationValidator = validateSearchByInformationForm as jest.MockedFn<
    typeof validateSearchByInformationForm
  >
  const mockedSearchByUlnValidator = validateSearchByUlnForm as jest.MockedFn<typeof validateSearchByUlnForm>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const learnerRecordsService = new LearnerRecordsService(null, null) as jest.Mocked<LearnerRecordsService>
  const controller = new SearchForLearnerRecordController(auditService, learnerRecordsService)

  const req = {
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

      await controller.postSearchForLearnerRecordByUln(req, res, next)

      expect(res.redirectWithErrors).toHaveBeenCalledWith('/search-for-learner-record-by-uln', errors)
    })
  })

  describe('should redirect to appropriate page depending on the response from LRS', () => {
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
      const responseType = 'No match returned from LRS'
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
})
