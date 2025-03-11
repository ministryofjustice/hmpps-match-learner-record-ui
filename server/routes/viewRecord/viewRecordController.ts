import { RequestHandler } from 'express'
import type { LearnerEventsRequest, LearnerRecord } from 'learnerRecordsApi'
import LearnerRecordsService from '../../services/learnerRecordsService'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'
import AuditService, { Page } from '../../services/auditService'

export default class ViewRecordController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly learnerRecordsService: LearnerRecordsService,
    private readonly auditService: AuditService,
  ) {}

  private logPageView = (username: string, correlationId: string) => {
    this.auditService.logPageView(Page.PRISONER_SEARCH_PAGE, {
      who: username,
      correlationId,
    })
  }

  getViewRecord: RequestHandler = async (req, res, next): Promise<void> => {
    this.logPageView(req.user.username, req.id)
    try {
      const selectedLearner: LearnerRecord = req.session.searchByInformationResults.matchedLearners.find(
        learner => learner.uln === req.params.uln,
      )

      const learnerEventsRequest: LearnerEventsRequest = {
        givenName: selectedLearner.givenName,
        familyName: selectedLearner.familyName,
        uln: selectedLearner.uln,
      }

      const prisoner = await this.prisonerSearchService.getPrisonerByPrisonNumber(
        req.params.prisonNumber,
        req.user.username,
      )
      const learningEvents = (
        await this.learnerRecordsService.getLearnerEvents(learnerEventsRequest, req.user.username)
      ).learnerRecord

      return res.render('pages/viewRecord', {
        prisoner,
        learner: selectedLearner,
        learningEvents,
      })
    } catch (error) {
      return next(error)
    }
  }
}
