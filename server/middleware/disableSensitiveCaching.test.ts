import { Request, Response, NextFunction } from 'express'
import noCacheMiddleware from './disableSensitiveCaching'

describe('disableSensitiveCaching middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = {}
    res = {
      setHeader: jest.fn(),
    }
    next = jest.fn()
  })

  it('should set Cache-Control and Pragma headers', () => {
    noCacheMiddleware(req as Request, res as Response, next as NextFunction)

    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store')
    expect(res.setHeader).toHaveBeenCalledWith('Pragma', 'no-cache')
    expect(next).toHaveBeenCalled()
  })
})
