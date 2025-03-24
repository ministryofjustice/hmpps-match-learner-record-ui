import prisoners from '../mockData/prisonerByIdData'
import LandingPage from '../pages/landing/landingPage'
import Page from '../pages/page'

const chosenPrisoner = prisoners.G5005GD.response.jsonBody

context('Match By ULN Journey', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubPrisonerSearch')
    cy.task('stubPrisonerImage')
    cy.task('stubGetPrisonerById', chosenPrisoner.prisonerNumber)
    cy.task('stubNoMatchForAll')
    cy.task('stubLearnerEventsExactMatch')
    cy.task('stubSignIn')
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
})
