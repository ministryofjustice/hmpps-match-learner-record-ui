import { RequestHandler } from 'express'

export default class ViewRecordController {
  getViewRecord: RequestHandler = async (req, res, next): Promise<void> => {
    return res.render('pages/viewRecord')
  }
}
