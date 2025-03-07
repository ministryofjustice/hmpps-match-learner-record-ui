import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import matchConfirmedRoutes from './matchConfirmed'
import findAPrisonerRoutes from './prisonerSearch'
import thereIsAProblemRoutes from './problem'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    services.auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    res.render('pages/index')
  })

  findAPrisonerRoutes(router, services)
  thereIsAProblemRoutes(router)
  router.use(matchConfirmedRoutes(services.auditService))

  return router
}
