import { dataAccess } from '../data'
import LearnerRecordsApiClient from '../data/learnerRecordsApiClient'
import LearnerRecordsService from './learnerRecordsService'
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import AuditService from './auditService'
import PrisonerSearchService from './prisonerSearch/prisonerSearchService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const learnerRecordsService = new LearnerRecordsService(hmppsAuthClient, new LearnerRecordsApiClient())

  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, new PrisonerSearchClient())

  return {
    applicationInfo,
    auditService,
    learnerRecordsService,
    prisonerSearchService,
  }
}

export type Services = ReturnType<typeof services>
