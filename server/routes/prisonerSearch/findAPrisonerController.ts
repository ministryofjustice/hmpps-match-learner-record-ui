import { RequestHandler } from 'express'
import { differenceInYears, parse } from 'date-fns'
import type { FindAPrisonerForm } from 'forms'
import AuditService, { Page } from '../../services/auditService'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'
import validateFindAPrisonerForm from './findAPrisonerValidator'

export default class FindAPrisonerController {
  constructor(
    private readonly auditService: AuditService,
    private readonly prisonerSearchService: PrisonerSearchService,
  ) {}

  private logPageView = (username: string, correlationId: string) => {
    this.auditService.logPageView(Page.PRISONER_SEARCH_PAGE, {
      who: username,
      correlationId,
    })
  }

  getFindAPrisoner: RequestHandler = async (req, res, next): Promise<void> => {
    this.logPageView(res.locals.user.username, req.id)
    return res.render('pages/findAPrisoner/index', req.session.searchResults)
  }

  postFindAPrisoner: RequestHandler = async (req, res, next): Promise<void> => {
    this.logPageView(res.locals.user.username, req.id)
    const findAPrisonerForm = { ...req.body } as FindAPrisonerForm

    const errors = validateFindAPrisonerForm(findAPrisonerForm)

    if (errors.length > 0) {
      return res.redirectWithErrors('/find-a-prisoner', errors)
    }

    try {
      const searchResult = await this.prisonerSearchService.searchPrisoners(
        findAPrisonerForm.search,
        'default-username',
      )
      const mappedResult = searchResult.map(record => ({
        age: record.dateOfBirth
          ? differenceInYears(new Date(), parse(record.dateOfBirth as unknown as string, 'dd-MM-yyyy', new Date()))
          : undefined,
        ...record,
      }))
      req.session.searchResults = { data: mappedResult, search: req.body.search }
      return res.render('pages/findAPrisoner/index', { data: mappedResult, search: req.body.search })
    } catch (error) {
      return next(error)
    }
  }

  clearResultsAndRedirect: RequestHandler = async (req, res, next): Promise<void> => {
    req.session.searchResults = { data: [], search: '' }
    return res.redirect('/find-a-prisoner')
  }
}
