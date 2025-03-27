import express from 'express'
import { populateCurrentUser, populateCurrentUserCaseloads } from './populateCurrentUser'
import { Services } from '../services'

export default function setUpCurrentUser({ userService }: Services) {
  const router = express.Router()

  router.use(populateCurrentUser(userService))
  router.use(populateCurrentUserCaseloads(userService))

  return router
}
