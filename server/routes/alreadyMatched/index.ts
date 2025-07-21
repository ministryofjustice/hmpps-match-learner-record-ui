import { Router } from 'express'
import AlreadyMatchedController from './alreadyMatchedController'
import { Services } from '../../services'
import noCacheMiddleware from '../../middleware/disableSensitiveCaching'

export default function alreadyMatchedRoutes(router: Router, services: Services) {
  const alreadyMatchedController = new AlreadyMatchedController(services.auditService)
  router.get('/already-matched/:prisonerNumber/:uln', [noCacheMiddleware, alreadyMatchedController.getAlreadyMatched])
}
