declare module 'prisonerApi' {
  export interface Prisoner {
    prisonerNumber: string
    pncNumber?: string
    pncNumberCanonicalShort?: string
    pncNumberCanonicalLong?: string
    croNumber?: string
    bookingId?: string
    bookNumber?: string
    firstName: string
    middleNames?: string
    lastName: string
    dateOfBirth: string
    gender?: string
    ethnicity?: string
    youthOffender?: boolean
    maritalStatus?: string
    religion?: string
    nationality?: string
    status?: string
    lastMovementTypeCode?: string
    lastMovementReasonCode?: string
    inOutStatus?: 'IN' | 'OUT' | 'TRN'
    prisonId?: string
    prisonName?: string
    cellLocation?: string
    aliases?: components['schemas']['PrisonerAlias'][]
    alerts?: components['schemas']['PrisonerAlert'][]
    csra?: string
    category?: string
    legalStatus?:
      | 'RECALL'
      | 'DEAD'
      | 'INDETERMINATE_SENTENCE'
      | 'SENTENCED'
      | 'CONVICTED_UNSENTENCED'
      | 'CIVIL_PRISONER'
      | 'IMMIGRATION_DETAINEE'
      | 'REMAND'
      | 'UNKNOWN'
      | 'OTHER'
    imprisonmentStatus?: string
    imprisonmentStatusDescription?: string
    mostSeriousOffence?: string
    recall?: boolean
    indeterminateSentence?: boolean
    sentenceStartDate?: string
    releaseDate?: string
    confirmedReleaseDate?: string
    sentenceExpiryDate?: string
    licenceExpiryDate?: string
    homeDetentionCurfewEligibilityDate?: string
    homeDetentionCurfewActualDate?: string
    homeDetentionCurfewEndDate?: string
    topupSupervisionStartDate?: string
    topupSupervisionExpiryDate?: string
    additionalDaysAwarded?: number
    nonDtoReleaseDate?: string
    nonDtoReleaseDateType?: 'ARD' | 'CRD' | 'NPD' | 'PRRD'
    receptionDate?: string
    paroleEligibilityDate?: string
    automaticReleaseDate?: string
    postRecallReleaseDate?: string
    conditionalReleaseDate?: string
    actualParoleDate?: string
    tariffDate?: string
    locationDescription?: string
    restrictedPatient: boolean
    supportingPrisonId?: string
    dischargedHospitalId?: string
    dischargedHospitalDescription?: string
    dischargeDate?: string
    dischargeDetails?: string
    currentIncentive?: components['schemas']['CurrentIncentive']
    heightCentimetres?: number
    weightKilograms?: number
    hairColour?:
      | 'Bald'
      | 'Balding'
      | 'Black'
      | 'Blonde'
      | 'Brown'
      | 'Brunette'
      | 'Dark'
      | 'Dyed'
      | 'Ginger'
      | 'Grey'
      | 'Light'
      | 'Mouse'
      | 'Multi-coloured'
      | 'Red'
      | 'White'
    rightEyeColour?: 'Blue' | 'Brown' | 'Clouded' | 'Green' | 'Grey' | 'Hazel' | 'Missing' | 'Pink' | 'White'
    leftEyeColour?: 'Blue' | 'Brown' | 'Clouded' | 'Green' | 'Grey' | 'Hazel' | 'Missing' | 'Pink' | 'White'
    facialHair?:
      | 'Full Beard'
      | 'Clean Shaven'
      | 'Goatee Beard'
      | 'Moustache Only'
      | 'Not Applicable (Female Offender)'
      | 'No Facial Hair'
      | 'Sideburns'
    shapeOfFace?: 'Angular' | 'Bullet' | 'Oval' | 'Round' | 'Square' | 'Triangular'
    build?:
      | 'Fat'
      | 'Frail'
      | 'Heavy'
      | 'Medium'
      | 'Muscular'
      | 'Obese'
      | 'Proportional'
      | 'Slight'
      | 'Small'
      | 'Stocky'
      | 'Stooped'
      | 'Thin'
    shoeSize?: number
    tattoos?: components['schemas']['BodyPartDetail'][]
    scars?: components['schemas']['BodyPartDetail'][]
    marks?: components['schemas']['BodyPartDetail'][]
    otherMarks?: components['schemas']['BodyPartDetail'][]
  }
}
