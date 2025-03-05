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

  @Expose()
  pncNumber: string

  @Expose()
  croNumber: string

  @Transform(({ value }) => (value ? value.toLocaleDateString('en-GB').replace(/\//g, '-') : null))
  @Type(() => Date)
  @Expose()
  dateOfBirth: Date

  @Expose()
  mostSeriousOffence: string

  @Expose()
  category: string

  @Expose()
  nationality: string

  @Type(() => Date)
  @Expose()
  sentenceExpiryDate: Date

  @Type(() => Date)
  @Expose()
  licenceExpiryDate: Date

  @Type(() => Date)
  @Expose()
  paroleEligibilityDate: Date

  @Type(() => Date)
  @Expose()
  homeDetentionCurfewEligibilityDate: Date

  @Type(() => Date)
  @Expose()
  releaseDate: Date

  @Expose()
  alerts?: object[]

  @Expose()
  restrictedPatient: boolean

  @Expose()
  locationDescription: string

  @Expose()
  lastMovementTypeCode: string

  @Expose()
  lastMovementReasonCode: string

  @Expose()
  indeterminateSentence: boolean

  @Expose()
  recall: boolean

  @Type(() => Date)
  @Expose()
  conditionalReleaseDate: Date
}
