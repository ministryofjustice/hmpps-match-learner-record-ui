import Page, { PageElement } from '../page'
import SearchByUlnPage from '../searchForLearnerRecord/searchByUlnPage'

export default class FindAPrisonerPage extends Page {
  constructor() {
    super('Find the prisoner you want to match')
  }

  enterPrisonerName(value: string): FindAPrisonerPage {
    this.searchField().clear().type(value)
    return this
  }

  clickSearch(): FindAPrisonerPage {
    this.searchButton().click()
    return Page.verifyOnPage(FindAPrisonerPage)
  }

  selectPrisoner(prisonerName: string): SearchByUlnPage {
    this.prisonerListTable().contains(prisonerName).click()
    return Page.verifyOnPage(SearchByUlnPage)
  }

  hasPrisonerResults(): FindAPrisonerPage {
    this.prisonerListTable().should('be.exist')
    this.prisonerListTable().should('not.contain', 'No results found')
    this.prisonerListTable().get('tbody tr').should('have.length.greaterThan', 0)
    return this
  }

  private searchField = (): PageElement => cy.get('#searchInput')

  private searchButton = (): PageElement => cy.get('#searchButton')

  prisonerListTable = (): PageElement => cy.get('#prisonerListTable')
}
