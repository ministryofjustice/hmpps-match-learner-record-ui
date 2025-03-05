import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import AuditService, { Page } from '../services/auditService'

export default function matchConfirmedRoutes(auditService: AuditService): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/match-confirmed', async (req, res) => {
    const { firstName, lastName, uln, prisonerNumber } = req.query
    await auditService.logPageView(Page.MATCH_CONFIRMED_PAGE, { who: res.locals.user.username, correlationId: req.id })
    res.render('pages/matchConfirmed', { firstName, lastName, uln, prisonerNumber })
  })

  return router
}
