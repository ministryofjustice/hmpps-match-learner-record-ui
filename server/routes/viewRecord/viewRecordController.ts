import { RequestHandler } from 'express'
import type { ConfirmMatchRequest, LearnerEventsRequest, LearnerRecord } from 'learnerRecordsApi'
import type { PrisonerSummary } from 'viewModels'
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

    let selectedLearner: LearnerRecord
    let prisoner: PrisonerSummary

    try {
      prisoner = await this.prisonerSearchService.getPrisonerByPrisonNumber(req.params.prisonNumber, req.user.username)
    } catch (error) {
      return next(error)
    }

    try {
      selectedLearner = req.session.searchByInformationResults.matchedLearners.find(
        learner => learner.uln === req.params.uln,
      )
    } catch {
      try {
        selectedLearner = {
          uln: req.params.uln,
          givenName: prisoner.firstName,
          familyName: prisoner.lastName,
          dateOfBirth: prisoner.dateOfBirth.toISOString().slice(0, 10),
        } as LearnerRecord

        req.session.searchByInformationResults = {
          searchParameters: null,
          responseType: 'Exact match',
          matchedLearners: [selectedLearner],
        }
      } catch (error) {
        return next(error)
      }
    }

    req.session.prisoner = prisoner

    try {
      const learnerEventsRequest: LearnerEventsRequest = {
        givenName: selectedLearner.givenName,
        familyName: selectedLearner.familyName,
        uln: selectedLearner.uln,
      }

      const learnerEventsResponse = await this.learnerRecordsService.getLearnerEvents(
        learnerEventsRequest,
        req.user.username,
      )

      const { responseType } = learnerEventsResponse

      const backBase = req.session.returnTo || '/learner-search-results/'
      req.session.returnTo = ''

      this.auditService.logAuditEvent({
        what: 'VIEW_LEARNER_RECORD',
        who: req.user.username,
        subjectId: selectedLearner.uln,
        subjectType: 'ULN',
      })

      if (responseType === 'Learner opted to not share data' || responseType === 'Learner could not be verified') {
        return res.render('pages/viewRecord/recordNotViewable', {
          responseType,
          prisonerNumber: prisoner.prisonerNumber,
          backBase,
        })
      }

      return res.render('pages/viewRecord/recordPage', {
        prisoner,
        learner: selectedLearner,
        learnerEvents: learnerEventsResponse.learnerRecord,
        backBase,
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
      this.auditService.logAuditEvent({
        what: 'MATCH_CONFIRMED',
        who: req.user.username,
        subjectId: req.params.prisonNumber,
        subjectType: 'Prison Number',
        details: {
          matchingUln: req.body.matchingUln,
        },
      })
      return res.redirect(`/match-confirmed/${req.params.prisonNumber}/${req.body.matchingUln}`)
    } catch (error) {
      return next(error)
    }
  }
}
