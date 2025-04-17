import { parse } from 'date-fns'

import type { SearchByInformationForm, SearchByUlnForm } from 'forms'
import { RequestHandler } from 'express'
import type { LearnerRecord } from 'learnerRecordsApi'
import AuditService, { Page } from '../../services/auditService'
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

  private logPageView = (page: Page, username: string, correlationId: string) => {
    this.auditService.logPageView(page, {
      who: username,
      correlationId,
    })
  }

  getSearchForLearnerRecordViewByUln: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.returnTo = ''
    this.logPageView(Page.SEARCH_BY_ULN_PAGE, req.user.username, req.id)

    const prisoner =
      req.session.searchResults?.data?.find((p: { prisonerNumber: string }) => p.prisonerNumber === prisonNumber) || {}
    const form = {
      uln: prisoner.matchedUln,
      ...req.session.searchByUlnForm,
    }
    return res.render('pages/searchForLearnerRecord/byUln', { form })
  }

  getSearchForLearnerRecordViewByInformation: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.returnTo = ''
    this.logPageView(Page.SEARCH_BY_INFORMATION_PAGE, req.user.username, req.id)

    const prisoner =
      req.session.searchResults?.data?.find((p: { prisonerNumber: string }) => p.prisonerNumber === prisonNumber) || {}
    const form = {
      givenName: prisoner.firstName,
      familyName: prisoner.lastName,
      sex: prisoner.gender?.toUpperCase(),
      postcode: prisoner.postalCode,
      'dob-day':
        prisoner.dateOfBirth &&
        parse(prisoner.dateOfBirth, 'dd-MM-yyyy', new Date()).getDate().toString().padStart(2, '0'),
      'dob-month':
        prisoner.dateOfBirth &&
        (parse(prisoner.dateOfBirth, 'dd-MM-yyyy', new Date()).getMonth() + 1).toString().padStart(2, '0'),
      'dob-year': prisoner.dateOfBirth && parse(prisoner.dateOfBirth, 'dd-MM-yyyy', new Date()).getFullYear(),
      ...req.session.searchByInformationForm,
    }
    return res.render('pages/searchForLearnerRecord/byInformation', { form })
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

      this.auditService.logAuditEvent({
        what: 'SEARCH_FOR_LEARNER_RECORD',
        who: req.user.username,
        correlationId: req.id,
        subjectId: req.params.prisonNumber,
        subjectType: 'Prison Number',
        details: {
          searchParameters: searchDemographics,
          responseType: searchResult.responseType,
        },
      })

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
      const prisoner = res.locals.prisonerSummary

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
