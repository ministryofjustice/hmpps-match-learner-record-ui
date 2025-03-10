import { Router } from 'express'
import LearnerSearchResultsController from './learnerSearchResultsController'

export default (router: Router) => {
  const searchForLearnerRecordController = new LearnerSearchResultsController()

  router.get('/learner-search-results', searchForLearnerRecordController.getLearnerSearchResults)
}
