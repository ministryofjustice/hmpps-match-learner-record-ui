import { dataAccess } from '../data'
import LearnerRecordsApiClient from '../data/learnerRecordsApiClient'
import LearnerRecordsService from './learnerRecordsService'
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import AuditService from './auditService'
import PrisonerSearchService from './prisonerSearch/prisonerSearchService'
import PrisonApiService from './prisonApi/prisonApiService'
import PrisonApiClient from '../data/prisonApi/prisonApiClient'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const learnerRecordsService = new LearnerRecordsService(hmppsAuthClient, new LearnerRecordsApiClient())

  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, new PrisonerSearchClient())
  const prisonApiService = new PrisonApiService(hmppsAuthClient, new PrisonApiClient())

  return {
    applicationInfo,
    auditService,
    learnerRecordsService,
    prisonerSearchService,
    prisonApiService,
  }
}

export type Services = ReturnType<typeof services>
