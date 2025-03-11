import { Request, Response } from 'express'
import ViewRecordController from './viewRecordController'
import AuditService from '../../services/auditService'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'
import LearnerRecordsService from '../../services/learnerRecordsService'

jest.mock('../../services/auditService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')
jest.mock('../../services/learnerRecordsService')

describe('ViewRecordController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const prisonerSearchService = new PrisonerSearchService(null, null) as jest.Mocked<PrisonerSearchService>
  const learnerRecordsService = new LearnerRecordsService(null, null) as jest.Mocked<LearnerRecordsService>
  const controller = new ViewRecordController(prisonerSearchService, learnerRecordsService)
  auditService.logPageView = jest.fn()

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
      learnerRecord: [],
    })
    prisonerSearchService.getPrisonerByPrisonNumber = jest.fn().mockResolvedValue({
      prisonerNumber: 'A1234BC',
    })
  })

  describe('getViewRecord', () => {
    it('should render the view Record page', async () => {
      await controller.getViewRecord(req, res, null)
      expect(res.render).toHaveBeenCalledWith('pages/viewRecord', {
        learner: { uln: '1234567890' },
        learningEvents: [],
        prisoner: { prisonerNumber: 'A1234BC' },
      })
    })
  })
})
