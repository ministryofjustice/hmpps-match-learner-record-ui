import { Request, Response, NextFunction } from 'express'
import logger from '../../logger'

export default function problemHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  logger.error('Service encountered a problem:', err.message)
  res.status(500)
  res.redirect('/there-is-a-problem')
}
