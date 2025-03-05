import type { SearchByInformationForm, SearchByUlnForm } from 'forms'
import { RequestHandler } from 'express'
import AuditService from '../../services/auditService'
import validateSearchByInformationForm from './searchByInformationValidator'
import validateSearchByUlnForm from './searchByUlnValidator'

export default class SearchForLearnerRecordController {
  constructor(private readonly auditService: AuditService) {}

  getSearchForLearnerRecordViewByUln: RequestHandler = async (req, res, next): Promise<void> => {
    return res.render('pages/searchForLearnerRecord/byUln', {})
  }

  getSearchForLearnerRecordViewByInformation: RequestHandler = async (req, res, next): Promise<void> => {
    return res.render('pages/searchForLearnerRecord/byInformation', { form: req.session.searchByInformationForm })
  }

  postSearchForLearnerRecordByInformation: RequestHandler = async (req, res, next): Promise<void> => {
    const searchByInformationForm = { ...req.body } as SearchByInformationForm
    req.session.searchByInformationForm = searchByInformationForm

    const errors = validateSearchByInformationForm(searchByInformationForm)

    if (errors.length > 0) {
      return res.redirectWithErrors('/search-for-learner-record-by-information', errors)
    }

    return res.render('pages/searchForLearnerRecord/byInformation', {})
  }

  postSearchForLearnerRecordByUln: RequestHandler = async (req, res, next): Promise<void> => {
    const searchByUlnForm = { ...req.body } as SearchByUlnForm
    req.session.searchByUlnForm = searchByUlnForm

    const errors = validateSearchByUlnForm(searchByUlnForm)

    if (errors.length > 0) {
      return res.redirectWithErrors('/search-for-learner-record-by-uln', errors)
    }

    return res.render('pages/searchForLearnerRecord/byUln', {})
  }
}
