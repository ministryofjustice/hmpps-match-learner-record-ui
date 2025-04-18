import { Request, Response } from 'express'
import NoMatchFoundController from './NoMatchFoundController'

describe('FindPrisonerController', () => {
  const controller = new NoMatchFoundController()

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

  describe('getNoMatchFoundView', () => {
    it('should render the No Match Found page', async () => {
      await controller.getNoMatchFound(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/noMatchFound', {
        givenName: 'GivenName',
        familyName: 'FamilyName',
        prisonerNumber: 'A123456',
      })
    })
  })
})
