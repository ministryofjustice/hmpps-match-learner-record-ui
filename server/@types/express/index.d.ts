import type { LearnersResponse } from 'learnerRecordsApi'
import type { PrisonerSummary } from 'viewModels'
import type { UserDetails } from '../../services/userService'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    searchByInformationForm: SearchByInformationForm
    searchByUlnForm: SearchByUlnForm
    searchByInformationResults: LearnersResponse
    prisoner: PrisonerSummary
    searchResults: SearchResults
  }
}

export declare global {
  namespace Express {
    interface User extends Partial<UserDetails> {
      username: string
      token: string
      authSource: string
    }

    interface Response {
      redirectWithSuccess?(path: string, message: string): void

      redirectWithErrors?(path: string, message: Record<string, string>[]): void
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }
  }
}
