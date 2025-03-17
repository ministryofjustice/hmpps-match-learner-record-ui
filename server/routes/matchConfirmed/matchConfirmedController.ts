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
    try {
      if (req.params.prisonerNumber !== req.session.prisoner.prisonerNumber) {
        throw new Error('Prisoner number in url does not match session data.')
      }
      return res.render('pages/matchConfirmed/confirmedPage', {
        firstName: req.session.prisoner.firstName,
        lastName: req.session.prisoner.lastName,
        uln: req.params.uln,
        prisonerNumber: req.params.prisonerNumber,
      })
    } catch (error) {
      return next(error)
    }
  }
}
