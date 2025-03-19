import { Request } from 'express'

const clearSessionData = (req: Request): void => {
  req.session.searchByInformationForm = {}
  req.session.searchByUlnForm = {}
  req.session.searchResults = { data: [], search: '' }
  req.session.returnTo = ''
  req.session.prisoner = undefined
  req.session.searchByInformationResults = undefined
}

export default clearSessionData
