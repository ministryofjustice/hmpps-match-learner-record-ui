import { dataAccess } from '../data'
import PrisonerSearchClient from '../data/prisonerSearchClient'
import AuditService from './auditService'
import PrisonApiService from './prisonApiService'
import PrisonerSearchService from './prisonerSearchService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)

  const prisonApiService = new PrisonApiService()

  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, new PrisonerSearchClient())

  return {
    applicationInfo,
    auditService,
    prisonApiService,
    prisonerSearchService,
  }
}

export type Services = ReturnType<typeof services>
