import prisoners from '../../mockData/prisonerByIdData'
import Error500Page from '../../pages/error500'
import LandingPage from '../../pages/landing/landingPage'
import Page from '../../pages/page'

const chosenPrisoner = prisoners.G5005GD.response.jsonBody

context('LRS Down Journey', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubPrisonerApiPrisonerSearch')
    cy.task('stubPrisonApiPrisonerImage')
    cy.task('stubPrisonerApiGetPrisonerById', chosenPrisoner.prisonerNumber)
    cy.task('stubLearnerRecordsNoMatchForAll')
    cy.task('stubLearnerRecordsEventsExactMatch')
    cy.task('stubLearnerRecordsLearnersLRSDownError')
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

    // Search Results
    searchByInformationPage.enterGivenName('John').enterFamilyName('Doe').enterDateOfBirthName('01', '01', '1990')

    searchByInformationPage.searchButton().click()
    Page.verifyOnPage(Error500Page)
  })
})
