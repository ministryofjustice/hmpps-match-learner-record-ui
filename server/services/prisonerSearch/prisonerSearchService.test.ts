import HmppsAuthClient from '../../data/hmppsAuthClient'
import PrisonerSearchClient from '../../data/prisonerSearch/prisonerSearchClient'
import PrisonerSearchService from './prisonerSearchService'

jest.mock('../../data/prisonerSearch/prisonerSearchClient')
jest.mock('../../data/hmppsAuthClient')

describe('PrisonerSearchService', () => {
  let prisonerSearchService: PrisonerSearchService
  let mockHmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let mockPrisonSearchClient: jest.Mocked<PrisonerSearchClient>

  beforeEach(() => {
    mockHmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
    mockHmppsAuthClient.getSystemClientToken = jest.fn().mockResolvedValue('mock-token')
    mockPrisonSearchClient = {
      search: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<PrisonerSearchClient>
    prisonerSearchService = new PrisonerSearchService(mockHmppsAuthClient, mockPrisonSearchClient)
  })

  it('should call with first and last name if a space is present', async () => {
    const searchString = 'John Doe'

    await prisonerSearchService.searchPrisoners(searchString, 'username')

    expect(mockPrisonSearchClient.search).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Doe' }, 'mock-token')
  })

  it('if many names are given, call with the first and last of them', async () => {
    const searchString = 'John Doe Smith'

    await prisonerSearchService.searchPrisoners(searchString, 'username')

    expect(mockPrisonSearchClient.search).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Smith' }, 'mock-token')
  })

  it('should call with prisoner number if no space is present', async () => {
    const searchString = 'A1234BC'

    await prisonerSearchService.searchPrisoners(searchString, 'username')

    expect(mockPrisonSearchClient.search).toHaveBeenCalledWith({ prisonerIdentifier: 'A1234BC' }, 'mock-token')
  })
})
