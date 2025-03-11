import { RequestHandler } from 'express'
import { differenceInYears, parse } from 'date-fns'
import AuditService, { Page } from '../../services/auditService'
import PrisonerSearchService from '../../services/prisonerSearch/prisonerSearchService'

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
    return res.render('pages/findAPrisoner', { search: '' })
  }

  postFindAPrisoner: RequestHandler = async (req, res, next): Promise<void> => {
    this.logPageView(res.locals.user.username, req.id)
    try {
      const searchResult = await this.prisonerSearchService.searchPrisoners(req.body.search, 'default-username')
      const mappedResult = searchResult.map(record => ({
        age: record.dateOfBirth
          ? differenceInYears(new Date(), parse(record.dateOfBirth as unknown as string, 'dd-MM-yyyy', new Date()))
          : undefined,
        ...record,
      }))
      return res.render('pages/findAPrisoner', { data: mappedResult, search: req.body.search })
    } catch (error) {
      return next(error)
    }
  }
}
