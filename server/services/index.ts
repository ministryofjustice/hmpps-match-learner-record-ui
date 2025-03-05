import { dataAccess } from '../data'
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import AuditService from './auditService'
import PrisonerSearchService from './prisonerSearch/prisonerSearchService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)

  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, new PrisonerSearchClient())

  return {
    applicationInfo,
    auditService,
    prisonerSearchService,
  }
}

export type Services = ReturnType<typeof services>
