import { Expose, Type, Transform } from 'class-transformer'

export default class PrisonerSearchResult {
  @Expose()
  prisonerNumber: string

  @Transform(({ value }) => (value ? value.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase()) : null))
  @Expose()
  firstName: string

  @Transform(({ value }) => (value ? value.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase()) : null))
  @Expose()
  lastName: string

  @Expose()
  prisonId: string

  @Expose()
  prisonName: string

  @Expose()
  cellLocation: string

  @Transform(({ value }) => (value ? value.toLocaleDateString('en-GB').replace(/\//g, '-') : null))
  @Type(() => Date)
  @Expose()
  dateOfBirth: Date

  @Expose()
  nationality: string

  @Expose()
  gender: string

  @Expose()
  postalCode: string
}
