import { dataAccess } from '../data'
import AuditService from './auditService'
import PrisonApiService from './prisonApiService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)

  const prisonApiService = new PrisonApiService()

  return {
    applicationInfo,
    auditService,
    prisonApiService,
  }
}

export type Services = ReturnType<typeof services>
