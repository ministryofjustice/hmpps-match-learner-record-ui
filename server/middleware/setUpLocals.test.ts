/* eslint-disable @typescript-eslint/no-explicit-any */
import setUpLocals from './setUpLocals'
import config from '../config'

describe('setUpLocals middleware', () => {
  it('should set res.locals.openLrsLink from config and call next', () => {
    const middleware = setUpLocals().stack[0].handle

    // Mock req, res, next
    const req = {} as any
    const res = { locals: {} } as any
    const next = jest.fn()

    // Call the middleware
    middleware(req, res, next)

    // It sets the config value correctly
    expect(res.locals.openLrsLink).toBe(config.openLrsLink)

    // It calls next()
    expect(next).toHaveBeenCalled()
  })
})
