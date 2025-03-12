import { RequestHandler } from 'express'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'

export default class TooManyResultsController {
  constructor() {}

  getTooManyResults: RequestHandler = async (req, res, next): Promise<void> => {
    return res.render('pages/tooManyResults')
  }

  postTooManyResults: RequestHandler = async (req, res, next): Promise<void> => {}
}
