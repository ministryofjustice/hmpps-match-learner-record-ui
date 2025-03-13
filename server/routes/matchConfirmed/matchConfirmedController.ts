import { RequestHandler } from 'express'
import AuditService, { Page } from '../../services/auditService'

export default class MatchConfirmedController {
  constructor(private readonly auditService: AuditService) {}

  private logPageView = (username: string, correlationId: string) => {
    this.auditService.logPageView(Page.MATCH_CONFIRMED_PAGE, {
      who: username,
      correlationId,
    })
  }

  getMatchConfirmed: RequestHandler = async (req, res, next): Promise<void> => {
    this.logPageView(res.locals.user.username, req.id)
    res.render('pages/matchConfirmed', {
      firstName: 'John',
      lastName: 'Smith',
      uln: '1234567890',
      prisonerNumber: 'A1234BC',
    })
  }
}
