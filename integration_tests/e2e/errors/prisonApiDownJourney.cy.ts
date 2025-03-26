import prisoners from '../../mockData/prisonerByIdData'
import Error500Page from '../../pages/error500'
import LandingPage from '../../pages/landing/landingPage'
import Page from '../../pages/page'

const chosenPrisoner = prisoners.G5005GD.response.jsonBody

context('Prison Api Down Journey', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubPrisonerApiPrisonerSearch')
    cy.task('stubPrisonApiPrisonerImage500Response')
    cy.task('stubPrisonerApiGetPrisonerById', chosenPrisoner.prisonerNumber)
    cy.task('stubLearnerRecordsNoMatchForAll')
    cy.task('stubSignIn', { name: 'Someone Withaname', roles: ['ROLE_MATCH_LEARNER_RECORD_RW'] })
  })

  it('should be presented with the 500 error page if the Prison Api returns an error', () => {
    cy.signIn()
    cy.visit('/')

    // Landing Page
    const landingPage = Page.verifyOnPage(LandingPage)

    // Find A Prisoner
    const findAPrisonerPage = landingPage.clickStartNow()
    findAPrisonerPage.enterPrisonerName('John Doe')
    findAPrisonerPage.searchButton().click()

    // Error Page
    Page.verifyOnPage(Error500Page)
  })
})
