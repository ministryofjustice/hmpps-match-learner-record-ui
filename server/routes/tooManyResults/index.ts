import { Router } from 'express'
import TooManyResultsController from './tooManyResultsController'

export default function tooManyResultsRoutes(router: Router) {
  const tooManyResultsController = new TooManyResultsController()
  router.get('/too-many-results', tooManyResultsController.getTooManyResults)
  router.post('/too-many-results', tooManyResultsController.postTooManyResults)
}
