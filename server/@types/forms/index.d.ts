declare module 'forms' {
  export interface SearchByInformationForm {
    givenName: string
    familyName: string
    'dob-day': string
    'dob-month': string
    'dob-year': string
    postcode?: string
    sex?: string
  }

  export interface SearchByUlnForm {
    uln: string
  }

  export interface FindAPrisonerForm {
    search: string
  }

  export interface SearchResults {
    search: string
    data: {
      prisonerNumber: string
      firstName: string
      lastName: string
      prisonId: string
      prisonName: string
      cellLocation: string
      dateOfBirth: Date
      nationality: string
      age: number
    }[]
  }
}
