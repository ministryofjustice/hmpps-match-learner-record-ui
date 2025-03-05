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
}
