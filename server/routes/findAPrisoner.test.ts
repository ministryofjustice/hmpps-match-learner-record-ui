import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import PrisonerSearchService from '../services/prisonerSearchService'

jest.mock('../services/auditService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const prisonerSearchService = new PrisonerSearchService(null, null) as jest.Mocked<PrisonerSearchService>
prisonerSearchService.searchPrisoners = jest.fn()

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      prisonerSearchService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /find-a-prisoner', () => {
  it('should render the find a prisoner page', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/find-a-prisoner')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Find the prisoner you want to match')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.EXAMPLE_PAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})

describe('POST /find-a-prisoner', () => {
  it('should render the find a prisoner page', () => {
    auditService.logPageView.mockResolvedValue(null)
    prisonerSearchService.searchPrisoners.mockResolvedValue([
      {
        firstName: 'Example',
        prisonerNumber: '',
        lastName: 'Person',
        prisonId: '',
        prisonName: '',
        cellLocation: '',
        pncNumber: '',
        croNumber: '',
        dateOfBirth: undefined,
        mostSeriousOffence: '',
        category: '',
        nationality: '',
        sentenceExpiryDate: undefined,
        licenceExpiryDate: undefined,
        paroleEligibilityDate: undefined,
        homeDetentionCurfewEligibilityDate: undefined,
        releaseDate: undefined,
        restrictedPatient: false,
        locationDescription: '',
        lastMovementTypeCode: '',
        lastMovementReasonCode: '',
        indeterminateSentence: false,
        recall: false,
        conditionalReleaseDate: undefined,
      },
    ])

    return request(app)
      .post('/find-a-prisoner')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Find the prisoner you want to match')
        expect(res.text).toContain('Example')
        expect(res.text).toContain('Person')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.EXAMPLE_PAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})
