import { RequestHandler } from 'express'
import AuditService, { Page } from '../../services/auditService'

export default class LearnerSearchResultsController {
  constructor(private readonly auditService: AuditService) {}

  getLearnerSearchResults: RequestHandler = async (req, res, next): Promise<void> => {
    this.auditService.logPageView(Page.SEARCH_RESULTS_PAGE, { who: req.user.username, correlationId: req.id })
    const results = req.session.searchByInformationResults

    if (!results) {
      // Exit journey
      return res.redirect('/')
    }

    return res.render('pages/learnerSearchResults/results', {
      results: results.matchedLearners,
      prisonerNumber: req.params.prisonNumber,
    })
  }
}
