import { Request, Response } from 'express'
import type { LearnerRecord } from 'learnerRecordsApi'
import AuditService, { Page } from '../../services/auditService'
import LearnerSearchResultsController from './learnerSearchResultsController'

jest.mock('../../services/auditService')

describe('searchForLearnerRecordController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new LearnerSearchResultsController(auditService)

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

  const req = {
    id: '123',
    session: {
      searchByInformationResults: {
        matchedLearners: [learnerRecord],
      },
    },
    params: {
      prisonerNumber: 'A123456',
    },
    user: { username: 'test-user' },
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  } as unknown as Response

  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    errors = []
  })

  describe('getLearnerSearchResults', () => {
    it('should render search results page', async () => {
      await controller.getLearnerSearchResults(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH_RESULTS_PAGE, {
        who: req.user.username,
        correlationId: req.id,
      })
      expect(res.render).toHaveBeenCalledWith('pages/learnerSearchResults/results', {
        results: [learnerRecord],
        prisonerNumber: req.params.prisonNumber,
      })
    })
    it('should redirect to root if no search results are present', async () => {
      req.session.searchByInformationResults = undefined

      await controller.getLearnerSearchResults(req, res, next)

      expect(auditService.logPageView).toHaveBeenCalledWith(Page.SEARCH_RESULTS_PAGE, {
        who: req.user.username,
        correlationId: req.id,
      })
      expect(res.redirect).toHaveBeenCalledWith('/')
    })
  })
})
