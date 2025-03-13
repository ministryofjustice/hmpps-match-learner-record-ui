import { Request, Response } from 'express'
import ViewRecordController from './viewRecordController'
import AuditService, { Page } from '../../services/auditService'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'
import LearnerRecordsService from '../../services/learnerRecordsService'

jest.mock('../../services/auditService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')
jest.mock('../../services/learnerRecordsService')

describe('ViewRecordController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const prisonerSearchService = new PrisonerSearchService(null, null) as jest.Mocked<PrisonerSearchService>
  const learnerRecordsService = new LearnerRecordsService(null, null) as jest.Mocked<LearnerRecordsService>
  auditService.logPageView = jest.fn()
  const controller = new ViewRecordController(prisonerSearchService, learnerRecordsService, auditService)

  const req = {
    session: {
      searchByInformationResults: {
        matchedLearners: [
          {
            uln: '1234567890',
          },
        ],
      },
    },
    body: {},
    query: {},
    user: { username: 'test-user' },
    params: { prisonerNumber: 'A1234BC', uln: '1234567890' },
  } as unknown as Request

  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    status: jest.fn(),
    locals: { user: { username: 'test-user' } },
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
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord/recordPage', {
        learner: { uln: '1234567890' },
        learnerEvents: [],
        prisoner: { prisonerNumber: 'A1234BC' },
        matchType: 'Exact Match',
      })
    })

    it('should render the learner not sharing data page', async () => {
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
      })
    })

    it('should render the learner not verified page', async () => {
      learnerRecordsService.getLearnerEvents = jest.fn().mockResolvedValue({
        responseType: 'Learner could not be verified',
        learnerRecord: [],
      })
      await controller.getViewRecord(req, res, null)
      expect(auditService.logPageView).toHaveBeenCalledWith(Page.VIEW_AND_MATCH_RECORD_PAGE, {
        who: req.user.username,
        correlationId: undefined,
      })
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord/recordNotViewable', {
        responseType: 'Learner could not be verified',
        prisonerNumber: 'A1234BC',
      })
    })

    it('should pass errors to middleware for handling', async () => {
      const error = new Error('Failed when calling api')
      learnerRecordsService.getLearnerEvents.mockRejectedValue(error)
      await controller.getViewRecord(req, res, next)
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
