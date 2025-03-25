import { RequestHandler } from 'express'
import AuditService, { Page } from '../../services/auditService'

export default class AlreadyMatchedController {
  constructor(private readonly auditService: AuditService) {}

  private logPageView = (username: string, correlationId: string) => {
    this.auditService.logPageView(Page.ALREADY_MATCHED_PAGE, {
      who: username,
      correlationId,
    })
  }

  getAlreadyMatched: RequestHandler = async (req, res, next): Promise<void> => {
    this.logPageView(res.locals.user.username, req.id)
    const { prisonerNumber, uln } = req.params
    const backBase = req.session.returnTo
    return res.render('pages/matchConfirmed/alreadyMatched', {
      prisonerNumber,
      uln,
      backBase,
    })
  }
}
