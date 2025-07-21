import { Request, Response, NextFunction } from 'express'

// Prevent caching for sensitive content
const disableSensitiveCaching = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Pragma', 'no-cache')
  next()
}

export default disableSensitiveCaching
