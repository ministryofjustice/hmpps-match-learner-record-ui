import LearnerSearchResultsPage from '../learnerSearchResults/learnerSearchResultsPage'
import Page, { PageElement } from '../page'
// eslint-disable-next-line import/no-cycle
import SearchByUlnPage from './searchByUlnPage'

export default class SearchByInformationPage extends Page {
  constructor() {
    super("Search for John Smith's learner record")
  }

  enterGivenName(value: string): SearchByInformationPage {
    this.givenNameField().clear().type(value)
    return this
  }

  enterFamilyName(value: string): SearchByInformationPage {
    this.familyNameField().clear().type(value)
    return this
  }

  enterDateOfBirthName(day: string, month: string, year: string): SearchByInformationPage {
    this.dobDayField().clear().type(day)
    this.dobMonthField().clear().type(month)
    this.dobYearField().clear().type(year)
    return this
  }

  enterPostcode(value: string): SearchByInformationPage {
    this.postcodeField().clear().type(value)
    return this
  }

  selectSex(value: string): SearchByInformationPage {
    this.sexField().select(value)
    return this
  }

  clickSearch(): LearnerSearchResultsPage {
    this.searchButton().click()
    return Page.verifyOnPage(LearnerSearchResultsPage)
  }

  clickSearchByUlnTabLink(): SearchByUlnPage {
    this.searchByUlnTabLink().click()
    return Page.verifyOnPage(SearchByUlnPage)
  }

  private givenNameField = (): PageElement => cy.get('#givenName')

  private familyNameField = (): PageElement => cy.get('#familyName')

  private dobDayField = (): PageElement => cy.get('#dob-day')

  private dobMonthField = (): PageElement => cy.get('#dob-month')

  private dobYearField = (): PageElement => cy.get('#dob-year')

  private postcodeField = (): PageElement => cy.get('#postcode')

  private sexField = (): PageElement => cy.get('#sex')

  private searchButton = (): PageElement => cy.get('#search-button')

  private searchByUlnTabLink = (): PageElement => cy.get('#uln-tab-link')
}
