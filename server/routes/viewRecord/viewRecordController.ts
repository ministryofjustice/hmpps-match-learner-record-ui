import { RequestHandler } from 'express'
import type { ConfirmMatchRequest, LearnerEventsRequest, LearnerRecord } from 'learnerRecordsApi'
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

      req.session.prisoner = prisoner

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
        matchType: responseType,
      })
    } catch (error) {
      return next(error)
    }
  }

  postViewRecord: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const confirmMatchRequest: ConfirmMatchRequest = {
        matchingUln: req.body.matchingUln,
        givenName: req.body.givenName,
        familyName: req.body.familyName,
        matchType: req.body.matchType,
        countOfReturnedUlns: req.session.searchByInformationResults.matchedLearners.length.toString(),
      }
      await this.learnerRecordsService.confirmMatch(req.params.prisonNumber, confirmMatchRequest, req.user.username)
      return res.redirect(`/match-confirmed/${req.params.prisonNumber}/${req.body.matchingUln}`)
    } catch (error) {
      return next(error)
    }
  }
}
