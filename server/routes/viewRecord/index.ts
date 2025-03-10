import { Router } from 'express'
import ViewRecordController from './viewRecordController'

export default function viewRecordRoutes(router: Router) {
  const viewRecordController = new ViewRecordController()
  router.get('/view-record', viewRecordController.getViewRecord)
}
