import { Request, Response } from 'express'
import request from 'supertest'
import type { SearchByInformationForm } from 'forms'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'
import AuditService, { Page } from '../../services/auditService'
import PrisonerSearchResult from '../../data/prisonerSearch/prisonerSearchResult'
import FindAPrisonerController from '../prisonerSearch/findAPrisonerController'
import TooManyResultsController from './tooManyResultsController'

jest.mock('../../services/auditService')
jest.mock('../../services/prisonerSearch/prisonerSearchService')

describe('FindPrisonerController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new TooManyResultsController()
  auditService.logPageView = jest.fn()

  const req = {
    session: {
      searchByInformationForm: {
        givenName: 'GivenName',
        familyName: 'FamilyName',
      },
    },
    params: {
      prisonerNumber: 'A123456',
    },
    body: {},
    query: {},
    user: { username: 'test-user' },
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
  })

  describe('getTooManyResultsView', () => {
    it('should render the too Many Results page', async () => {
      auditService.logPageView.mockResolvedValue(null)
      await controller.getTooManyResults(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/tooManyResults', {
        givenName: 'GivenName',
        FamilyName: 'string',
        prisonerNumber: 'A123456',
      })
    })
  })
})

describe('postTooManyResults', () => {
  it('should render the find prisoner page with search results', async () => {
    const prisoners: PrisonerSearchResult[] = [
      {
        firstName: 'Example',
        prisonerNumber: '',
        lastName: 'Person',
        prisonId: '',
        prisonName: '',
        cellLocation: '',
        dateOfBirth: undefined,
        nationality: '',
      },
    ]
  })

  it('should pass errors to middleware for handling', async () => {})
})
