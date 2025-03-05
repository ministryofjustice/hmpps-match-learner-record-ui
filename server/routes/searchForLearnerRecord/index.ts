import { Router } from 'express'
import { Services } from '../../services'
import SearchForLearnerRecordController from './searchForLearnerRecordController'

export default (router: Router, services: Services) => {
  const searchForLearnerRecordController = new SearchForLearnerRecordController(services.auditService)

  router.get('/search-for-learner-record-by-uln', searchForLearnerRecordController.getSearchForLearnerRecordViewByUln)
  router.get(
    '/search-for-learner-record-by-information',
    searchForLearnerRecordController.getSearchForLearnerRecordViewByInformation,
  )
  router.post(
    '/search-for-learner-record-by-information',
    searchForLearnerRecordController.postSearchForLearnerRecordByInformation,
  )
  router.post('/search-for-learner-record-by-uln', searchForLearnerRecordController.postSearchForLearnerRecordByUln)
}
