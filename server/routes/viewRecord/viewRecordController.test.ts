import { Request, Response } from 'express'
import type { ConfirmMatchRequest } from 'learnerRecordsApi'
import ViewRecordController from './viewRecordController'
import AuditService, { Page } from '../../services/auditService'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'
import LearnerRecordsService from '../../services/learnerRecordsService'
import { SanitisedError } from '../../sanitisedError'

jest.mock('../../services/auditService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')
jest.mock('../../services/learnerRecordsService')

describe('ViewRecordController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const prisonerSearchService = new PrisonerSearchService(null, null) as jest.Mocked<PrisonerSearchService>
  const learnerRecordsService = new LearnerRecordsService(null, null) as jest.Mocked<LearnerRecordsService>
  auditService.logPageView = jest.fn()
  const controller = new ViewRecordController(prisonerSearchService, learnerRecordsService, auditService)

  const expectedFormData: ConfirmMatchRequest = {
    matchingUln: '1234567890',
    givenName: 'John',
    familyName: 'Doe',
    matchType: 'Exact Match',
    countOfReturnedUlns: '1',
  }

  const req = {
    session: {
      returnTo: '',
      searchByInformationResults: {
        matchedLearners: [
          {
            uln: '1234567890',
          },
        ],
      },
    },
    body: expectedFormData,
    query: {},
    user: { username: 'test-user' },
    params: { prisonNumber: 'A1234BC', prisonerNumber: 'A1234BC', uln: '1234567890' },
  } as unknown as Request

  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    status: jest.fn(),
    locals: {
      user: { username: 'test-user' },
      prisonerSummary: { prisonerNumber: 'A1234BC' },
    },
  } as unknown as Response

  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    learnerRecordsService.getLearnerEvents = jest.fn().mockResolvedValue({
      responseType: 'Exact Match',
      learnerRecord: [],
    })
    prisonerSearchService.getPrisonerByPrisonNumber = jest.fn().mockResolvedValue({
      prisonerNumber: 'A1234BC',
    })
  })

  describe('getViewRecord', () => {
    it('should render the view Record page', async () => {
      await controller.getViewRecord(req, res, null)
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.VIEW_AND_MATCH_RECORD_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
      expect(auditService.logAuditEvent).toHaveBeenCalledWith({
        what: 'VIEW_LEARNER_RECORD',
        who: req.user.username,
        subjectId: req.params.uln,
        subjectType: 'ULN',
      })
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord/recordPage', {
        learner: { uln: '1234567890' },
        learnerEvents: [],
        prisoner: { prisonerNumber: 'A1234BC' },
        matchType: 'Exact Match',
        backBase: '/learner-search-results/',
        sourcePage: '',
      })
    })

    it('should render the learner not sharing data page', async () => {
      learnerRecordsService.getLearnerEvents = jest.fn().mockResolvedValue({
        responseType: 'Learner opted to not share data',
        learnerRecord: [],
      })
      req.session.returnTo = ''
      await controller.getViewRecord(req, res, null)
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.VIEW_AND_MATCH_RECORD_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord/recordNotViewable', {
        responseType: 'Learner opted to not share data',
        prisonerNumber: 'A1234BC',
        backBase: '/learner-search-results/',
        sourcePage: '',
      })
    })

    it('should render the learner not verified page', async () => {
      learnerRecordsService.getLearnerEvents = jest.fn().mockResolvedValue({
        responseType: 'Learner could not be verified',
        learnerRecord: [],
      })
      req.session.returnTo = ''
      await controller.getViewRecord(req, res, null)
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.VIEW_AND_MATCH_RECORD_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord/recordNotViewable', {
        responseType: 'Learner could not be verified',
        prisonerNumber: 'A1234BC',
        backBase: '/learner-search-results/',
        sourcePage: '',
      })
    })

    it('should pass errors to middleware for handling', async () => {
      const error = new Error('Failed when calling api')
      learnerRecordsService.getLearnerEvents.mockRejectedValue(error)
      await controller.getViewRecord(req, res, next)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getViewRecordWithSourcePage', () => {
    it('should render the view Record page with Source Page', async () => {
      req.session.returnTo = '/search-for-learner-record-by-uln/'
      await controller.getViewRecord(req, res, null)
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.VIEW_AND_MATCH_RECORD_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
      expect(auditService.logAuditEvent).toHaveBeenCalledWith({
        what: 'VIEW_LEARNER_RECORD',
        who: req.user.username,
        subjectId: req.params.uln,
        subjectType: 'ULN',
      })
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord/recordPage', {
        learner: { uln: '1234567890' },
        learnerEvents: [],
        prisoner: { prisonerNumber: 'A1234BC' },
        matchType: 'Exact Match',
        backBase: '/search-for-learner-record-by-uln/',
        sourcePage: 'uln',
      })
    })

    it('should render the learner not sharing data page', async () => {
      req.session.returnTo = '/search-for-learner-record-by-uln/'
      learnerRecordsService.getLearnerEvents = jest.fn().mockResolvedValue({
        responseType: 'Learner opted to not share data',
        learnerRecord: [],
      })
      await controller.getViewRecord(req, res, null)
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.VIEW_AND_MATCH_RECORD_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord/recordNotViewable', {
        responseType: 'Learner opted to not share data',
        prisonerNumber: 'A1234BC',
        backBase: '/search-for-learner-record-by-uln/',
        sourcePage: 'uln',
      })
    })
  })

  describe('getViewMatchedRecord', () => {
    it('should render the view matched Record page', async () => {
      await controller.getViewMatchedRecord(req, res, null)
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.VIEW_AND_MATCH_RECORD_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
      expect(auditService.logAuditEvent).toHaveBeenCalledWith({
        what: 'VIEW_LEARNER_RECORD',
        who: req.user.username,
        subjectId: req.params.uln,
        subjectType: 'ULN',
      })
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord/matchedRecordPage', {
        learner: { uln: '1234567890' },
        learnerEvents: [],
        prisoner: { prisonerNumber: 'A1234BC' },
        matchType: 'Exact Match',
        backBase: '/find-a-prisoner',
        sourcePage: undefined,
      })
    })

    it('should render the learner not sharing data page', async () => {
      learnerRecordsService.getLearnerEvents = jest.fn().mockResolvedValue({
        responseType: 'Learner opted to not share data',
        learnerRecord: [],
      })
      req.session.returnTo = ''
      await controller.getViewMatchedRecord(req, res, null)
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.VIEW_AND_MATCH_RECORD_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord/recordNotViewable', {
        responseType: 'Learner opted to not share data',
        prisonerNumber: 'A1234BC',
        backBase: '/find-a-prisoner',
        sourcePage: undefined,
      })
    })

    it('should render the learner not verified page', async () => {
      learnerRecordsService.getLearnerEvents = jest.fn().mockResolvedValue({
        responseType: 'Learner could not be verified',
        learnerRecord: [],
      })
      await controller.getViewMatchedRecord(req, res, null)
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.VIEW_AND_MATCH_RECORD_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord/recordNotViewable', {
        responseType: 'Learner could not be verified',
        prisonerNumber: 'A1234BC',
        backBase: '/find-a-prisoner',
        sourcePage: undefined,
      })
    })

    it('should pass errors to middleware for handling', async () => {
      const error = new Error('Failed when calling api')
      learnerRecordsService.getLearnerEvents.mockRejectedValue(error)
      await controller.getViewMatchedRecord(req, res, next)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('postViewRecord', () => {
    it('should save the match and redirect to confirmed match page', async () => {
      await controller.postViewRecord(req, res, null)
      expect(learnerRecordsService.confirmMatch).toHaveBeenCalledWith('A1234BC', expectedFormData, req.user.username)
      expect(res.redirect).toHaveBeenCalledWith('/match-confirmed/A1234BC/1234567890')
    })
    it('should pass errors to middleware for handling', async () => {
      const error = new Error('Failed when calling api')
      learnerRecordsService.confirmMatch.mockRejectedValue(error)
      await controller.postViewRecord(req, res, next)
      expect(next).toHaveBeenCalledWith(error)
    })
    it('should show already matched page if CONFLICT', async () => {
      const error = new Error('Failed when calling api') as SanitisedError
      error.status = 409
      learnerRecordsService.confirmMatch.mockRejectedValue(error)
      await controller.postViewRecord(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(`/already-matched/A1234BC/1234567890`)
    })
  })
})
