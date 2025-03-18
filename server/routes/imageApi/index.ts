import { Router } from 'express'
import { Services } from '../../services'
import ImageApiController from './imageApiController'

export default function findAPrisonerRoutes(router: Router, services: Services) {
  const apiController = new ImageApiController(services.auditService, services.prisonApiService)
  router.get('/api/image/:imageId', apiController.prisonerImage)
}
