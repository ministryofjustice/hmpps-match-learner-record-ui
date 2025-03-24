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
    cy.task('stubLearnerEventsExactMatch')
    cy.task('stubLearnerResultsPossibleMatch')
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

  it('should be able to navigate to search by information page from search by uln page', () => {
    cy.signIn()

    cy.visit('/')
    const landingPage = Page.verifyOnPage(LandingPage)
    const findAPrisonerPage = landingPage.clickStartNow()

    findAPrisonerPage.enterPrisonerName('John Doe').clickSearch()
    findAPrisonerPage.prisonerListTable().should('be.exist')
    const searchByUlnPage = findAPrisonerPage.selectPrisoner(`${chosenPrisoner.firstName} ${chosenPrisoner.lastName}`)
    searchByUlnPage.clickSearchByInformationTabLink()
  })

  it('should be able to search for an individual record by ULN', () => {
    cy.signIn()

    cy.visit('/')
    const landingPage = Page.verifyOnPage(LandingPage)
    const findAPrisonerPage = landingPage.clickStartNow()

    findAPrisonerPage.enterPrisonerName('John Doe').clickSearch()
    findAPrisonerPage.prisonerListTable().should('be.exist')

    const searchByUlnPage = findAPrisonerPage.selectPrisoner(`${chosenPrisoner.firstName} ${chosenPrisoner.lastName}`)
    const viewRecordPage = searchByUlnPage.enterUln('1234567890').clickSearch()
    viewRecordPage.hasUlnValue('1234567890')
    viewRecordPage.hasLearnerRecordResults()
    viewRecordPage.hasMatchingTableWithUlnAndPrisonNumber('1234567890', chosenPrisoner.prisonerNumber)
  })

  it('should be able to search for multiple records by information', () => {
    cy.signIn()

    cy.visit('/')
    const landingPage = Page.verifyOnPage(LandingPage)
    const findAPrisonerPage = landingPage.clickStartNow()

    findAPrisonerPage.enterPrisonerName('John Doe').clickSearch()
    findAPrisonerPage.prisonerListTable().should('be.exist')
    const searchByUlnPage = findAPrisonerPage.selectPrisoner(`${chosenPrisoner.firstName} ${chosenPrisoner.lastName}`)
    const searchByInformationPage = searchByUlnPage.clickSearchByInformationTabLink()
    const searchResultsPage = searchByInformationPage
      .enterGivenName('John')
      .enterFamilyName('Doe')
      .enterDateOfBirthName('01', '01', '1990')
      .clickSearch()
    searchResultsPage.hasLearnerSearchResults()
  })
})
