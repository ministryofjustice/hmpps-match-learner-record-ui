import { Request, Response } from 'express'
import validateSearchByInformationForm from './searchByInformationValidator'
import AuditService from '../../services/auditService'
import SearchForLearnerRecordController from './searchForLearnerRecordController'
import validateSearchByUlnForm from './searchByUlnValidator'
import LearnerRecordsService from '../../services/learnerRecordsService'

jest.mock('../../services/auditService')
jest.mock('./searchByInformationValidator')
jest.mock('./searchByUlnValidator')

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

      await controller.postSearchForLearnerRecordByInformation(req, res, next)

      expect(res.redirectWithErrors).toHaveBeenCalledWith('/search-for-learner-record-by-information', errors)
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
})
