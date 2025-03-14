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
    this.auditService.logPageView(Page.VIEW_AND_MATCH_RECORD_PAGE, {
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

      const learnerEventsResponse = await this.learnerRecordsService.getLearnerEvents(
        learnerEventsRequest,
        req.user.username,
      )

      const { responseType } = learnerEventsResponse

      if (responseType === 'Learner opted to not share data' || responseType === 'Learner could not be verified') {
        return res.render('pages/viewRecord/recordNotViewable', {
          responseType,
          prisonerNumber: prisoner.prisonerNumber,
        })
      }

      return res.render('pages/viewRecord/recordPage', {
        prisoner,
        learner: selectedLearner,
        learnerEvents: learnerEventsResponse.learnerRecord,
      })
    } catch (error) {
      return next(error)
    }
  }
}
