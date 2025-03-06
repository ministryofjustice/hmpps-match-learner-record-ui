import { RequestHandler } from 'express'

export default class ThereIsAProblemController {
  getThereIsAProblem: RequestHandler = async (req, res, next): Promise<void> => {
    return res.render('pages/thereIsAProblem')
  }
}
