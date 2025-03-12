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
  const controller = new TooManyResultsController()

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
      await controller.getTooManyResults(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/tooManyResults', {
        givenName: 'GivenName',
        familyName: 'FamilyName',
        prisonerNumber: 'A123456',
      })
    })
  })
})
