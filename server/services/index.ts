import { dataAccess } from '../data'
import LearnerRecordsApiClient from '../data/learnerRecordsApiClient'
import LearnerRecordsService from './learnerRecordsService'
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import AuditService from './auditService'
import PrisonerSearchService from './prisonerSearch/prisonerSearchService'
import UserService from './userService'
import ManageUsersApiClient from '../data/manageUsersApiClient'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const learnerRecordsService = new LearnerRecordsService(hmppsAuthClient, new LearnerRecordsApiClient())

  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, new PrisonerSearchClient())
  const userService = new UserService(new ManageUsersApiClient())

  return {
    applicationInfo,
    auditService,
    learnerRecordsService,
    prisonerSearchService,
    userService,
  }
}

export type Services = ReturnType<typeof services>
