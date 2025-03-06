import { Router } from 'express'
import { Services } from '../../services'
import LearnerSearchResultsController from './learnerSearchResultsController'

export default (router: Router, services: Services) => {
  const searchForLearnerRecordController = new LearnerSearchResultsController()

  router.get('/learner-search-results', searchForLearnerRecordController.getLearnerSearchResults)
}
