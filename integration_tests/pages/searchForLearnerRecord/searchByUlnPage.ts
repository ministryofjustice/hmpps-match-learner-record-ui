import Page, { PageElement } from '../page'
import ViewRecordPage from '../viewRecordPage/viewRecordPage'
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

  clickSearch(): ViewRecordPage {
    this.searchButton().click()
    return Page.verifyOnPage(ViewRecordPage)
  }

  clickSearchByInformationTabLink(): SearchByInformationPage {
    this.searchByInformationTabLink().click()
    return Page.verifyOnPage(SearchByInformationPage)
  }

  private ulnSearchField = (): PageElement => cy.get('#uln')

  private searchButton = (): PageElement => cy.get('#searchButton')

  private searchByInformationTabLink = (): PageElement => cy.get('#informationTabLink')
}
