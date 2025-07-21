import { Router } from 'express'
import TooManyResultsController from './tooManyResultsController'
import noCacheMiddleware from '../../middleware/disableSensitiveCaching'

export default function tooManyResultsRoutes(router: Router) {
  const tooManyResultsController = new TooManyResultsController()
  router.get('/too-many-results/:prisonerNumber', [noCacheMiddleware, tooManyResultsController.getTooManyResults])
}
