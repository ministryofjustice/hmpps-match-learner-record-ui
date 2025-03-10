declare module 'viewModels' {
  export interface PrisonerSummary {
    prisonerNumber: string
    prisonId: string
    firstName: string
    lastName: string
    dateOfBirth?: Date
    location: string
  }
}
