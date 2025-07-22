import { Router } from 'express'
import { Services } from '../../services'
import FindAPrisonerController from './findAPrisonerController'
import noCacheMiddleware from '../../middleware/disableSensitiveCaching'

export default function findAPrisonerRoutes(router: Router, services: Services) {
  const findAPrisonerController = new FindAPrisonerController(
    services.auditService,
    services.prisonerSearchService,
    services.prisonApiService,
    services.learnerRecordsService,
  )
  router.get('/find-a-prisoner', [noCacheMiddleware, findAPrisonerController.getFindAPrisoner])
  router.post('/find-a-prisoner', findAPrisonerController.postFindAPrisoner)
  router.get('/find-a-prisoner-clear', [noCacheMiddleware, findAPrisonerController.clearResultsAndRedirect])
}
