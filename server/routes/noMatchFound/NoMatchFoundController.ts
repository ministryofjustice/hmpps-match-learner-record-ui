import { RequestHandler } from 'express'

export default class NoMatchFoundController {
  constructor() {}

  getNoMatchFound: RequestHandler = async (req, res, next): Promise<void> => {
    const { givenName, familyName } = req.session.searchByInformationForm
    const { prisonerNumber } = req.params
    return res.render('pages/noMatchFound', {
      givenName,
      familyName,
      prisonerNumber,
    })
  }
}
