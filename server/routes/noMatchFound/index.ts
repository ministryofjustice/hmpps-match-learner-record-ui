import { Router } from 'express'
import NoMatchFoundController from './NoMatchFoundController'

export default function noMatchFoundRoutes(router: Router) {
  const noMatchFoundController = new NoMatchFoundController()
  router.get('/no-match-found/:prisonerNumber', noMatchFoundController.getNoMatchFound)
}
