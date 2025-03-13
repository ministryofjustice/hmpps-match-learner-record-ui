import { RequestHandler } from 'express'

export default class TooManyResultsController {
  constructor() {}

  getTooManyResults: RequestHandler = async (req, res, next): Promise<void> => {
    const { givenName, familyName } = req.session.searchByInformationForm
    const { prisonerNumber } = req.params
    return res.render('pages/tooManyResults', {
      givenName,
      familyName,
      prisonerNumber,
    })
  }
}
