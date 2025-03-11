import { RequestHandler } from 'express'
import type { LearnerEventsRequest, LearnerRecord } from 'learnerRecordsApi'
import LearnerRecordsService from '../../services/learnerRecordsService'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'

export default class ViewRecordController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly learnerRecordsService: LearnerRecordsService,
  ) {}

  getViewRecord: RequestHandler = async (req, res, next): Promise<void> => {
    // if not exist redirect to somewhere
    const selectedLearner: LearnerRecord = req.session.searchByInformationResults.matchedLearners.find(
      learner => learner.uln === req.params.uln,
    )

    const learnerEventsRequest: LearnerEventsRequest = {
      givenName: selectedLearner.givenName,
      familyName: selectedLearner.familyName,
      uln: selectedLearner.uln,
    }

    // handle errors

    const prisoner = await this.prisonerSearchService.getPrisonerByPrisonNumber(
      req.params.prisonNumber,
      req.user.username,
    )
    const learningEvents = (await this.learnerRecordsService.getLearnerEvents(learnerEventsRequest, req.user.username))
      .learnerRecord

    return res.render('pages/viewRecord', {
      prisoner,
      learner: selectedLearner,
      learningEvents,
    })
  }
}
