import { Router } from 'express'
import config from '../config'

// Add constants and utilities to locals
export default function setUpLocals(): Router {
  const router = Router({ mergeParams: true })

  router.use((req, res, next) => {
    res.locals.openLrsLink = config.openLrsLink
    next()
  })

  return router
}
