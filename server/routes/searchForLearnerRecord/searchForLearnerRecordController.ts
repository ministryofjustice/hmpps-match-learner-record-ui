import type { SearchByInformationForm, SearchByUlnForm } from 'forms'
import { RequestHandler } from 'express'
import AuditService from '../../services/auditService'
import validateSearchByInformationForm from './searchByInformationValidator'
import validateSearchByUlnForm from './searchByUlnValidator'
import LearnerRecordsService from '../../services/learnerRecordsService'
import logger from '../../../logger'
import { getYear } from '../../utils/utils'

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

    try {
      const day = searchByInformationForm['dob-day'].padStart(2, '0')
      const month = searchByInformationForm['dob-month'].padStart(2, '0')
      const year = getYear(searchByInformationForm['dob-year'])

      const searchDemographics = {
        givenName: searchByInformationForm.givenName,
        familyName: searchByInformationForm.familyName,
        dateOfBirth: `${year}-${month}-${day}`,
        gender: searchByInformationForm.sex || 'NOT_KNOWN',
        lastKnownPostCode: searchByInformationForm.postcode || 'ZZ99 9ZZ',
      }
      const searchResult = await this.learnerRecordsService.getLearnersByDemographicDetails(
        searchDemographics,
        req.user.username,
      )
      req.session.searchByInformationResults = searchResult
      return res.redirect('/learner-search-results')
    } catch (error) {
      logger.error(`Error communicating with prisoners api:`, error)
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
    // Todo request to get record by ULN and demographic details & redirect to record page
    return res.render('pages/searchForLearnerRecord/byUln', {})
  }
}
