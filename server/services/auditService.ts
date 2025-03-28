import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  LANDING_PAGE = 'LANDING_PAGE',
  PRISONER_SEARCH_PAGE = 'PRISONER_SEARCH_PAGE',
  SEARCH_BY_ULN_PAGE = 'SEARCH_BY_ULN_PAGE',
  SEARCH_BY_INFORMATION_PAGE = 'SEARCH_BY_INFORMATION_PAGE',
  SEARCH_RESULTS_PAGE = 'SEARCH_RESULTS_PAGE',
  VIEW_AND_MATCH_RECORD_PAGE = 'VIEW_AND_MATCH_RECORD_PAGE',
  MATCH_CONFIRMED_PAGE = 'MATCH_CONFIRMED_PAGE',
  ALREADY_MATCHED_PAGE = 'ALREADY_MATCHED_PAGE',
}

export interface PageViewEventDetails {
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: object
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  async logAuditEvent(event: AuditEvent) {
    await this.hmppsAuditClient.sendMessage(event)
  }

  async logPageView(page: Page, eventDetails: PageViewEventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `PAGE_VIEW_${page}`,
    }
    await this.hmppsAuditClient.sendMessage(event)
  }
}
