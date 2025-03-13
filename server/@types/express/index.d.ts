import type { SearchByInformationForm, SearchByUlnForm } from 'forms'
import type { LearnersResponse } from 'learnerRecordsApi'
import type { PrisonerSummary } from 'viewModels'
import { HmppsUser } from '../../interfaces/hmppsUser'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    searchByInformationForm: SearchByInformationForm
    searchByUlnForm: SearchByUlnForm
    searchByInformationResults: LearnersResponse
    prisoner: PrisonerSummary
  }
}

export declare global {
  namespace Express {
    interface User {
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

    interface Locals {
      user: HmppsUser
    }
  }
}
