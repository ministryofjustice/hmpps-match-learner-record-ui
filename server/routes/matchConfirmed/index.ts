import { Router } from 'express'
import MatchConfirmedController from './matchConfirmedController'
import { Services } from '../../services'

export default function matchConfirmedRoutes(router: Router, services: Services) {
  const matchConfirmedController = new MatchConfirmedController(services.auditService)
  router.get('/match-confirmed/:prisonerNumber/:uln', matchConfirmedController.getMatchConfirmed)
}
