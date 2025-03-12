import { Request, Response } from 'express'
import TooManyResultsController from './tooManyResultsController'

describe('FindPrisonerController', () => {
  const controller = new TooManyResultsController()

  const req = {
    session: {
      searchByInformationForm: {
        givenName: 'GivenName',
        familyName: 'FamilyName',
      },
    },
    params: {
      prisonerNumber: 'A123456',
    },
    body: {},
    query: {},
    user: { username: 'test-user' },
  } as unknown as Request

  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    status: jest.fn(),
    locals: { user: { username: 'test-user' } },
  } as unknown as Response

  const next = jest.fn()

  describe('getTooManyResultsView', () => {
    it('should render the too Many Results page', async () => {
      await controller.getTooManyResults(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/tooManyResults', {
        givenName: 'GivenName',
        familyName: 'FamilyName',
        prisonerNumber: 'A123456',
      })
    })
  })
})
