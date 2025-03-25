import { Router } from 'express'
import AlreadyMatchedController from './alreadyMatchedController'
import { Services } from '../../services'

export default function alreadyMatchedRoutes(router: Router, services: Services) {
  const alreadyMatchedController = new AlreadyMatchedController(services.auditService)
  router.get('/already-matched/:prisonerNumber/:uln', alreadyMatchedController.getAlreadyMatched)
}
