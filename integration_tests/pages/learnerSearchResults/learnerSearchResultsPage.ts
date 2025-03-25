import Page, { PageElement } from '../page'
import ViewRecordPage from '../viewRecordPage/viewRecordPage'

export default class LearnerSearchResultsPage extends Page {
  constructor() {
    super('Search results for')
  }

  selectPrisoner(prisonerName: string): ViewRecordPage {
    this.learnerSearchResultsTable().contains(prisonerName).click()
    return Page.verifyOnPage(ViewRecordPage)
  }

  hasLearnerSearchResults(): LearnerSearchResultsPage {
    this.learnerSearchResultsTable().should('be.exist')
    this.learnerSearchResultsTable().should('not.contain', 'No results found')
    this.learnerSearchResultsTable().get('tbody tr').should('have.length.greaterThan', 0)
    return this
  }

  hasTooManyResults(): LearnerSearchResultsPage {
    this.h2().should('contain.text', 'Too many results')
    return this
  }

  hasNoResults(): LearnerSearchResultsPage {
    this.h2().should('contain.text', '0 Results')
    return this
  }

  private learnerSearchResultsTable = (): PageElement => cy.get('#learnerSearchResultsTable')

  private h2 = (): PageElement => cy.get('h2')
}
