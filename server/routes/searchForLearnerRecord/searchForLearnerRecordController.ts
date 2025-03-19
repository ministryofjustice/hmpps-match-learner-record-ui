import type { SearchByInformationForm, SearchByUlnForm } from 'forms'
import { RequestHandler } from 'express'
import type { LearnerRecord } from 'learnerRecordsApi'
import AuditService from '../../services/auditService'
import validateSearchByInformationForm from './searchByInformationValidator'
import validateSearchByUlnForm from './searchByUlnValidator'
import LearnerRecordsService from '../../services/learnerRecordsService'
import logger from '../../../logger'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'

export default class SearchForLearnerRecordController {
  constructor(
    private readonly auditService: AuditService,
    private readonly learnerRecordsService: LearnerRecordsService,
    private readonly prisonerSearchService: PrisonerSearchService,
  ) {}

  getSearchForLearnerRecordViewByUln: RequestHandler = async (req, res, next): Promise<void> => {
    return res.render('pages/searchForLearnerRecord/byUln', { form: req.session.searchByUlnForm })
  }

  getSearchForLearnerRecordViewByInformation: RequestHandler = async (req, res, next): Promise<void> => {
    return res.render('pages/searchForLearnerRecord/byInformation', { form: req.session.searchByInformationForm })
  }

  postSearchForLearnerRecordByInformation: RequestHandler = async (req, res, next): Promise<void> => {
    const searchByInformationForm = { ...req.body } as SearchByInformationForm

    req.session.searchByInformationForm = searchByInformationForm

    const errors = validateSearchByInformationForm(searchByInformationForm)

    if (errors.length > 0) {
      return res.redirectWithErrors(`/search-for-learner-record-by-information/${req.params.prisonNumber}`, errors)
    }

    const searchDemographics = {
      givenName: searchByInformationForm.givenName,
      familyName: searchByInformationForm.familyName,
      dateOfBirth: `${searchByInformationForm['dob-year']}-${searchByInformationForm['dob-month'].padStart(2, '0')}-${searchByInformationForm['dob-day'].padStart(2, '0')}`,
      gender: searchByInformationForm.sex || 'NOT_KNOWN',
      lastKnownPostCode: searchByInformationForm.postcode || 'ZZ99 9ZZ',
    }
    try {
      const searchResult = await this.learnerRecordsService.getLearnersByDemographicDetails(
        searchDemographics,
        req.user.username,
      )
      req.session.searchByInformationResults = searchResult

      if (searchResult.responseType === 'Too Many Matches') {
        return res.redirect(`/too-many-results/${req.params.prisonNumber}`)
      }
      if (searchResult.responseType === 'No Match') {
        return res.redirect(`/no-match-found/${req.params.prisonNumber}`)
      }
      return res.redirect(`/learner-search-results/${req.params.prisonNumber}`)
    } catch (error) {
      logger.error(`Error communicating with BOLD - LRS API:`, error)
      return next(error)
    }
  }

  postSearchForLearnerRecordByUln: RequestHandler = async (req, res, next): Promise<void> => {
    const searchByUlnForm = { ...req.body } as SearchByUlnForm

    req.session.searchByUlnForm = searchByUlnForm

    const errors = validateSearchByUlnForm(searchByUlnForm)

    if (errors.length > 0) {
      return res.redirectWithErrors(`/search-for-learner-record-by-uln/${req.params.prisonNumber}`, errors)
    }

    try {
      const prisoner = await this.prisonerSearchService.getPrisonerByPrisonNumber(
        req.params.prisonNumber,
        req.user.username,
      )

      const selectedLearner = {
        uln: searchByUlnForm.uln,
        givenName: prisoner.firstName,
        familyName: prisoner.lastName,
        dateOfBirth: prisoner.dateOfBirth.toISOString().slice(0, 10),
      } as LearnerRecord

      req.session.searchByInformationResults = {
        searchParameters: null,
        responseType: 'Exact match',
        matchedLearners: [selectedLearner],
      }

      req.session.returnTo = '/search-for-learner-record-by-uln/'

      return res.redirect(`/view-record/${req.params.prisonNumber}/${selectedLearner.uln}`)
    } catch (error) {
      logger.error(`Error communicating with BOLD - LRS API:`, error)
      return next(error)
    }
  }
}
