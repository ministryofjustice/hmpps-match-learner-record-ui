import FindAPrisonerPage from '../findAPrisoner/findAPrisonerPage'
import Page, { PageElement } from '../page'

export default class LandingPage extends Page {
  constructor() {
    super("Match someone's learner record")
  }

  clickStartNow(): FindAPrisonerPage {
    this.startNowLink().click()
    return Page.verifyOnPage(FindAPrisonerPage)
  }

  private startNowLink = (): PageElement => cy.get('#start-now')
}
