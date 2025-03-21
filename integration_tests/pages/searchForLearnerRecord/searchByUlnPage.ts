import Page, { PageElement } from '../page'
// eslint-disable-next-line import/no-cycle
import SearchByInformationPage from './searchByInformationPage'

export default class SearchByUlnPage extends Page {
  constructor() {
    super("Search for John Smith's learner record")
  }

  enterUln(value: string): SearchByUlnPage {
    this.ulnSearchField().clear().type(value)
    return this
  }

  clickSearch(): SearchByUlnPage {
    this.searchButton().click()
    return Page.verifyOnPage(SearchByUlnPage)
  }

  clickSearchByInformationTabLink(): SearchByInformationPage {
    this.searchByInformationTabLink().click()
    return Page.verifyOnPage(SearchByInformationPage)
  }

  private ulnSearchField = (): PageElement => cy.get('#uln')

  private searchButton = (): PageElement => cy.get('#search-button')

  private searchByInformationTabLink = (): PageElement => cy.get('#information-tab-link')
}
