import { Request, Response } from 'express'
import validateSearchByInformationForm from './searchByInformationValidator'
import AuditService from '../../services/auditService'
import SearchForLearnerRecordController from './searchForLearnerRecordController'

jest.mock('../../services/auditService')

describe('searchForLearnerRecordController', () => {
  const mockedSearchByInformationValidator = validateSearchByInformationForm as jest.MockedFn<
    typeof validateSearchByInformationForm
  >
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new SearchForLearnerRecordController(auditService)

  const req = {
    session: {},
    body: {},
    query: {},
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
    // res.locals =
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
})
