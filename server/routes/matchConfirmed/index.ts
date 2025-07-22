import { Router } from 'express'
import MatchConfirmedController from './matchConfirmedController'
import { Services } from '../../services'
import noCacheMiddleware from '../../middleware/disableSensitiveCaching'

export default function matchConfirmedRoutes(router: Router, services: Services) {
  const matchConfirmedController = new MatchConfirmedController(services.auditService)
  router.get('/match-confirmed/:prisonerNumber/:uln', [noCacheMiddleware, matchConfirmedController.getMatchConfirmed])
}
