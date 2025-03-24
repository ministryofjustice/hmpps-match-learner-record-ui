import Page, { PageElement } from '../page'

export default class ViewRecordPage extends Page {
  constructor() {
    super('View and match learner record')
  }

  hasUlnValue(expected: string): ViewRecordPage {
    this.ulnValue().should('contain.text', expected)
    return this
  }

  hasLearnerRecordResults(): ViewRecordPage {
    this.learnerRecordTable().should('be.exist')
    this.learnerRecordTable().should('not.contain', 'No results found')
    this.learnerRecordTable().get('tbody tr').should('have.length.greaterThan', 0)
    return this
  }

  hasMatchingTableWithUlnAndPrisonNumber(uln: string, prisonNumber: string): ViewRecordPage {
    this.matchRecordTable().should('be.exist')
    this.matchRecordTable().should('not.contain', 'No results found')
    this.matchRecordTable().get('tbody tr').should('have.length.greaterThan', 0)
    this.matchRecordTable().get('tbody tr').should('contain', uln)
    this.matchRecordTable().get('tbody tr').should('contain', prisonNumber)
    return this
  }

  private ulnValue = (): PageElement => cy.get('#uln')

  private learnerRecordTable = (): PageElement => cy.get('#learner-record-table')

  private matchRecordTable = (): PageElement => cy.get('#match-record-table')
}
