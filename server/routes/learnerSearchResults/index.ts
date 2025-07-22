import { Router } from 'express'
import LearnerSearchResultsController from './learnerSearchResultsController'
import retrievePrisonerSummary from '../routerRequestHandlers/retrievePrisonerSummary'
import { Services } from '../../services'
import noCacheMiddleware from '../../middleware/disableSensitiveCaching'

export default (router: Router, services: Services) => {
  const searchForLearnerRecordController = new LearnerSearchResultsController(services.auditService)

  router.get('/learner-search-results/:prisonNumber', [
    noCacheMiddleware,
    retrievePrisonerSummary(services.prisonerSearchService),
    searchForLearnerRecordController.getLearnerSearchResults,
  ])
}
