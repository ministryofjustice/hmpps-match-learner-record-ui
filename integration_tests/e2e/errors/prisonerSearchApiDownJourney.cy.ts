import Error500Page from '../../pages/error500'
import LandingPage from '../../pages/landing/landingPage'
import Page from '../../pages/page'

context('Prisoner Search Api Down Journey', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubPrisonerApiPrisonerSearch500Error')
    cy.task('stubSignIn', { name: 'Someone Withaname', roles: ['ROLE_MATCH_LEARNER_RECORD_RW'] })
  })

  it('should be presented with the 500 error page if the prisoner search API returns an error', () => {
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
