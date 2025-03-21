import prisoners from '../mockData/prisonerByIdData'
import LandingPage from '../pages/landing/landingPage'
import Page from '../pages/page'

const chosenPrisoner = prisoners.G5005GD.response.jsonBody

context('Match By Information Journey', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubPrisonerSearch')
    cy.task('stubPrisonerImage')
    cy.task('stubGetPrisonerById', chosenPrisoner.prisonerNumber)
    cy.task('stubNoMatchForAll')
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
    findAPrisonerPage.prisonerListTable().should('be.exist')
  })

  it('should be able to navigate from a prisoner on the find a prisoner page', () => {
    cy.signIn()

    cy.visit('/')
    const landingPage = Page.verifyOnPage(LandingPage)
    const findAPrisonerPage = landingPage.clickStartNow()

    findAPrisonerPage.enterPrisonerName('John Doe').clickSearch()
    findAPrisonerPage.prisonerListTable().should('be.exist')
    findAPrisonerPage.selectPrisoner(`${chosenPrisoner.firstName} ${chosenPrisoner.lastName}`)
  })

  it('should be able to navigate to search by information page from search by uln page', () => {
    cy.signIn()

    cy.visit('/')
    const landingPage = Page.verifyOnPage(LandingPage)
    const findAPrisonerPage = landingPage.clickStartNow()

    findAPrisonerPage.enterPrisonerName('John Doe').clickSearch()
    findAPrisonerPage.prisonerListTable().should('be.exist')
    const searchByUlnPage = findAPrisonerPage.selectPrisoner(`${chosenPrisoner.firstName} ${chosenPrisoner.lastName}`)
    const searchByInformationPage = searchByUlnPage.clickSearchByInformationTabLink()
  })
})
