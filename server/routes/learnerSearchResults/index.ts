import { Router } from 'express'
import LearnerSearchResultsController from './learnerSearchResultsController'
import retrievePrisonerSummary from '../routerRequestHandlers/retrievePrisonerSummary'
import { Services } from '../../services'

export default (router: Router, services: Services) => {
  const searchForLearnerRecordController = new LearnerSearchResultsController(services.auditService)

  router.get('/learner-search-results/:prisonNumber', [
    retrievePrisonerSummary(services.prisonerSearchService),
    searchForLearnerRecordController.getLearnerSearchResults,
  ])
}
