import { RequestHandler } from 'express'
import AuditService from '../../services/auditService'

export default class SearchForLearnerRecordController {
  constructor(private readonly auditService: AuditService) {}

  getSearchForLearnerRecordViewByUln: RequestHandler = async (req, res, next): Promise<void> => {
    return res.render('pages/searchForLearnerRecord/byUln', {})
  }

  getSearchForLearnerRecordViewByInformation: RequestHandler = async (req, res, next): Promise<void> => {
    return res.render('pages/searchForLearnerRecord/byInformation', {})
  }
}
