import { Router } from 'express'
import { Services } from '../../services'
import SearchForLearnerRecordController from './searchForLearnerRecordController'
import retrievePrisonerSummary from '../routerRequestHandlers/retrievePrisonerSummary'

export default (router: Router, services: Services) => {
  const searchForLearnerRecordController = new SearchForLearnerRecordController(
    services.auditService,
    services.learnerRecordsService,
    services.prisonerSearchService,
  )

  router.get('/search-for-learner-record-by-uln/:prisonNumber', [
    retrievePrisonerSummary(services.prisonerSearchService),
    searchForLearnerRecordController.getSearchForLearnerRecordViewByUln,
  ])
  router.get('/search-for-learner-record-by-information/:prisonNumber', [
    retrievePrisonerSummary(services.prisonerSearchService),
    searchForLearnerRecordController.getSearchForLearnerRecordViewByInformation,
  ])
  router.post(
    '/search-for-learner-record-by-information/:prisonNumber',
    searchForLearnerRecordController.postSearchForLearnerRecordByInformation,
  )
  router.post('/search-for-learner-record-by-uln/:prisonNumber', [
    retrievePrisonerSummary(services.prisonerSearchService),
    searchForLearnerRecordController.postSearchForLearnerRecordByUln,
  ])
}
