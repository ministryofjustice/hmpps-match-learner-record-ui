import { Router } from 'express'
import ViewRecordController from './viewRecordController'
import { Services } from '../../services'

export default function viewRecordRoutes(router: Router, services: Services) {
  const viewRecordController = new ViewRecordController(
    services.prisonerSearchService,
    services.learnerRecordsService,
    services.auditService,
  )
  router.get('/view-record/:prisonNumber/:uln', viewRecordController.getViewRecord)
}
