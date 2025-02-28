import axios, { AxiosInstance } from 'axios'
import config from '../config'
import logger from '../../logger'

export interface GlobalSearchResult {
  content: {
    firstName: string
    lastName: string
    prisonerNumber: string
    nationality: string
  }[]
}

export default class PrisonApiService {
  private apiClient: AxiosInstance

  constructor() {
    const token = 'someToken'
    this.apiClient = axios.create({
      baseURL: config.apis.prisonersApi.url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
    })
  }

  async globalSearch(firstName: string, lastName: string): Promise<GlobalSearchResult> {
    try {
      const response = await this.apiClient.post('/global-search', {
        firstName,
        lastName,
      })
      return response.data
    } catch (error) {
      logger.error('Global search failed:', error.code, error.errors)
      return {
        content: [
          { firstName: 'John', lastName: 'Smith', prisonerNumber: 'A1234AA', nationality: 'English' },
          { firstName: 'Ben', lastName: 'Person', prisonerNumber: 'A1234DA', nationality: 'Spanish' },
          { firstName: 'Lyle', lastName: 'Someone', prisonerNumber: 'B1234AA', nationality: 'English' },
          { firstName: 'Gale', lastName: 'Jones', prisonerNumber: 'A1234RG', nationality: 'Welsh' },
          { firstName: 'Micheal', lastName: 'Campbell', prisonerNumber: 'G1234HA', nationality: 'French' },
        ],
      }
    }
  }
}
