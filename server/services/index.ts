import { dataAccess } from '../data'
import LearnerRecordsApiClient from '../data/learnerRecordsApiClient'
import AuditService from './auditService'
import LearnerRecordsService from './learnerRecordsService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const learnerRecordsService = new LearnerRecordsService(hmppsAuthClient, new LearnerRecordsApiClient())

  return {
    applicationInfo,
    auditService,
    learnerRecordsService,
  }
}

export type Services = ReturnType<typeof services>
