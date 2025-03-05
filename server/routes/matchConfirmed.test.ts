import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'

jest.mock('../services/auditService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /match-confirmed', () => {
  it('should render index page', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/match-confirmed?firstName=John&lastName="Smith&uln=1234567890&prisonerNumber=ABCDEFG')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Match confirmed')
        expect(res.text).toContain('John')
        expect(res.text).toContain('Smith')
        expect(res.text).toContain('1234567890')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.MATCH_CONFIRMED_PAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})
