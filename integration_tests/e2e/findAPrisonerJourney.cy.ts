import prisoners from '../mockData/prisonerByIdData'
import LandingPage from '../pages/landing/landingPage'
import Page from '../pages/page'

const chosenPrisoner = prisoners.G5005GD.response.jsonBody

context('Match By Information Journey', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubPrisonerApiPrisonerSearch')
    cy.task('stubPrisonApiPrisonerImage')
    cy.task('stubPrisonerApiGetPrisonerById', chosenPrisoner.prisonerNumber)
    cy.task('stubLearnerRecordsNoMatchForAll')
    cy.task('stubSignIn')
  })

  it('should render landing page', () => {
    cy.signIn()
    cy.visit('/')
    Page.verifyOnPage(LandingPage)
  })

  it('should navigate to find a prisoner page', () => {
    cy.signIn()
    cy.visit('/')

    const landingPage = Page.verifyOnPage(LandingPage)

    landingPage.clickStartNow()
  })

  it('should be able to submit find a prisoner page', () => {
    cy.signIn()
    cy.visit('/')

    const landingPage = Page.verifyOnPage(LandingPage)

    const findAPrisonerPage = landingPage.clickStartNow()
    findAPrisonerPage.enterPrisonerName('John Doe').clickSearch()
    findAPrisonerPage.hasPrisonerResults()
  })

  it('should be able to navigate from the find a prisoner page', () => {
    cy.signIn()
    cy.visit('/')

    const landingPage = Page.verifyOnPage(LandingPage)

    const findAPrisonerPage = landingPage.clickStartNow()
    findAPrisonerPage.enterPrisonerName('John Doe').clickSearch()
    findAPrisonerPage.prisonerListTable().should('be.exist')
    findAPrisonerPage.selectPrisoner(`${chosenPrisoner.firstName} ${chosenPrisoner.lastName}`)
  })
})
