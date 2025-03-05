import { Router } from 'express'
import { Services } from '../../services'
import FindAPrisonerController from './findAPrisonerController'

export default function findAPrisonerRoutes(router: Router, services: Services) {
  const findAPrisonerController = new FindAPrisonerController(services.auditService, services.prisonerSearchService)
  router.get('/find-a-prisoner', findAPrisonerController.getFindAPrisoner)
  router.post('/find-a-prisoner', findAPrisonerController.postFindAPrisoner)
}
