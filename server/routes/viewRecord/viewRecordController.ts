import { NextFunction, Request, Response, RequestHandler } from 'express'
import type { LearnerEventsRequest, LearnerRecord } from 'learnerRecordsApi'
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

    const selectedLearner: LearnerRecord = req.session.searchByInformationResults.matchedLearners.find(
      learner => learner.uln === req.params.uln,
    )

    const prisoner = await this.prisonerSearchService.getPrisonerByPrisonNumber(
      req.params.prisonNumber,
      req.user.username,
    )

    return showLearnerRecords(
      this.learnerRecordsService,
      selectedLearner,
      prisoner,
      '/learner-search-results/',
      req,
      res,
      next,
    )
  }
}

export async function showLearnerRecords(
  learnerRecordsService: LearnerRecordsService,
  selectedLearner: LearnerRecord,
  prisoner: PrisonerSummary,
  backBase: string,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const learnerEventsRequest: LearnerEventsRequest = {
      givenName: selectedLearner.givenName,
      familyName: selectedLearner.familyName,
      uln: selectedLearner.uln,
    }

    const learnerEventsResponse = await learnerRecordsService.getLearnerEvents(learnerEventsRequest, req.user.username)

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
      backBase,
    })
  } catch (error) {
    return next(error)
  }
}
