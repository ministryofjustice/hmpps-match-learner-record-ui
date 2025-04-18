import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import searchForLearnerRecord from './searchForLearnerRecord'
import learnerSearchResults from './learnerSearchResults'
import findAPrisonerRoutes from './prisonerSearch'
import thereIsAProblemRoutes from './problem'
import tooManyResultsRoutes from './tooManyResults'
import viewRecordRoutes from './viewRecord'
import apiRoutes from './imageApi'
import matchConfirmedRoutes from './matchConfirmed/index'
import noMatchFoundRoutes from './noMatchFound'
import alreadyMatchedRoutes from './alreadyMatched'

export const standardGetPaths = /^(?!\/api|\/save-backlink|^\/$).*/

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    services.auditService.logPageView(Page.LANDING_PAGE, { who: res.locals.user.username, correlationId: req.id })
    res.render('pages/index')
  })

  apiRoutes(router, services)
  searchForLearnerRecord(router, services)
  learnerSearchResults(router, services)
  findAPrisonerRoutes(router, services)
  thereIsAProblemRoutes(router)
  tooManyResultsRoutes(router)
  noMatchFoundRoutes(router)
  viewRecordRoutes(router, services)
  matchConfirmedRoutes(router, services)
  alreadyMatchedRoutes(router, services)

  return router
}
