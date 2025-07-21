import path from 'path'
import compression from 'compression'
import express, { Router } from 'express'
import noCache from 'nocache'

import config from '../config'

export default function setUpStaticResources(): Router {
  const router = express.Router()

  router.use(compression())

  //  Static Resources Configuration
  const cacheControl = { maxAge: config.staticResourceCacheDuration, redirect: false }

  // Function to exclude hidden files
  const excludeHiddenFiles = (res: { setHeader: (arg0: string, arg1: string) => void }, filePath: string) => {
    if (filePath.split('/').some(part => part.startsWith('.'))) {
      // Skip hidden files by not setting headers
      return
    }
    // Allow other files
    res.setHeader('Cache-Control', `max-age=${cacheControl.maxAge}`)
  }

  Array.of(
    '/dist/assets',
    '/node_modules/govuk-frontend/dist/govuk/assets',
    '/node_modules/govuk-frontend/dist',
    '/node_modules/@ministryofjustice/frontend/moj/assets',
    '/node_modules/@ministryofjustice/frontend',
    '/node_modules/jquery/dist',
  ).forEach(dir => {
    router.use('/assets', express.static(path.join(process.cwd(), dir), { setHeaders: excludeHiddenFiles }))
  })

  Array.of('/node_modules/jquery/dist/jquery.min.js').forEach(dir => {
    router.use(
      '/assets/js/jquery.min.js',
      express.static(path.join(process.cwd(), dir), { setHeaders: excludeHiddenFiles }),
    )
  })

  // Don't cache dynamic resources
  router.use(noCache())

  return router
}
