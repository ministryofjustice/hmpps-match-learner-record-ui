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

  private searchField = (): PageElement => cy.get('#search-input')

  private searchButton = (): PageElement => cy.get('#search-button')

  prisonerListTable = (): PageElement => cy.get('#prisoner-list-table')
}
