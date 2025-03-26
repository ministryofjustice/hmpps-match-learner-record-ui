import { Router } from 'express'
import ViewRecordController from './viewRecordController'
import { Services } from '../../services'
import retrievePrisonerSummary from '../routerRequestHandlers/retrievePrisonerSummary'

export default function viewRecordRoutes(router: Router, services: Services) {
  const viewRecordController = new ViewRecordController(
    services.prisonerSearchService,
    services.learnerRecordsService,
    services.auditService,
  )
  router.get('/view-record/:prisonNumber/:uln', [
    retrievePrisonerSummary(services.prisonerSearchService),
    viewRecordController.getViewRecord,
  ])
  router.post('/view-record/:prisonNumber/:uln', viewRecordController.postViewRecord)
}
