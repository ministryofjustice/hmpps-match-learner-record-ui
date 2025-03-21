import LandingPage from '../pages/landing/landingPage'
import Page from '../pages/page'

context('Landing page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubPrisonerSearch')
    cy.task('stubPrisonerImage')
    cy.task('stubNoMatchForAll')
  })

  it('should render landing page', () => {
    // Given
    cy.task('stubSignIn')
    cy.signIn()

    // When
    cy.visit('/')

    // Then
    const landingPage = Page.verifyOnPage(LandingPage)
  })

  it('should progress to find a prisoner page', () => {
    // Given
    cy.task('stubSignIn')
    cy.signIn()

    // When
    cy.visit('/')

    // Then
    const landingPage = Page.verifyOnPage(LandingPage)

    const findAPrisonerPage = landingPage.clickStartNow()
  })

  it('should be able to submit find a prisoner page', () => {
    // Given
    cy.task('stubSignIn')
    cy.signIn()

    // When
    cy.visit('/')

    // Then
    const landingPage = Page.verifyOnPage(LandingPage)

    const findAPrisonerPage = landingPage.clickStartNow()

    findAPrisonerPage.enterPrisonerName('John Doe').clickSearch()

    findAPrisonerPage.prisonerListTable().should('be.exist')
  })
})
