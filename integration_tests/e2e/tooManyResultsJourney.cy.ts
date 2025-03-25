import prisoners from '../mockData/prisonerByIdData'
import LandingPage from '../pages/landing/landingPage'
import Page from '../pages/page'

const chosenPrisoner = prisoners.G5005GD.response.jsonBody

context('Too Many Results Journey', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubPrisonerSearch')
    cy.task('stubPrisonerImage')
    cy.task('stubGetPrisonerById', chosenPrisoner.prisonerNumber)
    cy.task('stubNoMatchForAll')
    cy.task('stubLearnerResultsTooManyMatches')
    cy.task('stubSignIn')
  })

  it('should be able to search for multiple records by information', () => {
    cy.signIn()
    cy.visit('/')

    // Landing Page
    const landingPage = Page.verifyOnPage(LandingPage)

    // Find A Prisoner
    const findAPrisonerPage = landingPage.clickStartNow()
    findAPrisonerPage.enterPrisonerName('John Doe').clickSearch()
    findAPrisonerPage.prisonerListTable().should('be.exist')

    // Search By ULN
    const searchByUlnPage = findAPrisonerPage.selectPrisoner(`${chosenPrisoner.firstName} ${chosenPrisoner.lastName}`)

    // Search By Information
    const searchByInformationPage = searchByUlnPage.clickSearchByInformationTabLink()

    // Search Results - Too Many Results
    const searchResultsPage = searchByInformationPage
      .enterGivenName('John')
      .enterFamilyName('Doe')
      .enterDateOfBirthName('01', '01', '1990')
      .clickSearch()
    searchResultsPage.hasTooManyResults()
  })
})
