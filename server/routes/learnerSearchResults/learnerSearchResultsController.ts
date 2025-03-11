import { RequestHandler } from 'express'

export default class LearnerSearchResultsController {
  constructor() {}

  getLearnerSearchResults: RequestHandler = async (req, res, next): Promise<void> => {
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
