import { Request, Response, NextFunction } from 'express'
import logger from '../../logger'
import problemHandler from './problemHandler'

jest.mock('../../logger')

describe('problemHandler Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      redirect: jest.fn(),
    }
    next = jest.fn()
  })

  it('should log the error and redirect to "/there-is-a-problem"', () => {
    const errorText = 'Days since last error: 3̵6̵4̵ - 0'
    const error = new Error(errorText)
    problemHandler(error, req as Request, res as Response, next)
    expect(logger.error).toHaveBeenCalledWith('Service encountered a problem:', errorText)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.redirect).toHaveBeenCalledWith('/there-is-a-problem')
  })
})
