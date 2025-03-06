import type { SearchByInformationForm, SearchByUlnForm } from 'forms'
import { RequestHandler } from 'express'
import AuditService from '../../services/auditService'
import validateSearchByInformationForm from './searchByInformationValidator'
import validateSearchByUlnForm from './searchByUlnValidator'
import LearnerRecordsService from '../../services/learnerRecordsService'

export default class SearchForLearnerRecordController {
  constructor(
    private readonly auditService: AuditService,
    private readonly learnerRecordsService: LearnerRecordsService,
  ) {}

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

    const searchDemographics = {
      givenName: searchByInformationForm.givenName,
      familyName: searchByInformationForm.familyName,
      dateOfBirth: `${searchByInformationForm['dob-year']}-${searchByInformationForm['dob-month']}-${searchByInformationForm['dob-day']}`,
      gender: searchByInformationForm.sex || 'NOT_KNOWN',
      lastKnownPostCode: searchByInformationForm.postcode || 'ZZ99 9ZZ',
    }
    try {
      const searchResult = await this.learnerRecordsService.getLearnersByDemographicDetails(
        searchDemographics,
        req.user.username,
      )
      req.session.searchByInformationResults = searchResult
      return res.redirect('/learner-search-results')
    } catch (error) {
      console.error(`Error communicating with prisoners api:`, error)
      return res.redirect(500, '/find-a-prisoner')
    }
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
