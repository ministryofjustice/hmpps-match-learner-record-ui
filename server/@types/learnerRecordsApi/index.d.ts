declare module 'learnerRecordsApi' {
  export interface LearnerSearchByDemographic {
    givenName: string
    familyName: string
    dateOfBirth?: string
    lastKnownPostCode?: string
    gender?: string
  }

  export interface LearnerRecord {
    createdDate: string
    lastUpdatedDate: string
    uln: string
    versionNumber: string
    title: string
    givenName: string
    middleOtherName: string
    familyName: string
    preferredGivenName: string
    previousFamilyName: string
    familyNameAtAge16: string
    schoolAtAge16: string
    lastKnownAddressLine1: string
    lastKnownAddressTown: string
    lastKnownAddressCountyOrCity: string
    lastKnownPostCode: string
    dateOfAddressCapture: string
    dateOfBirth: string
    placeOfBirth: string
    gender: string
    emailAddress: string
    scottishCandidateNumber: string
    abilityToShare: string
    learnerStatus: string
    verificationType: string
    tierLevel: string
  }

  export interface LearnersResponse {
    searchParameters: LearnerSearchByDemographic
    responseType: string
    matchedLearners: LearnerRecord[]
  }

  export interface LearnerEventsRequest {
    givenName: string
    familyName: string
    uln: string
  }

  export interface LearnerEventsResponse {
    searchParameters: LearnerEventsRequest
    responseType: LRSResponseType
    foundUln: string
    incomingUln: string
    learnerRecord: LearnerEvents[]
  }

  export interface LearnerEvents {
    id?: string
    achievementProviderUkprn?: string
    achievementProviderName?: string
    awardingOrganisationName?: string
    qualificationType?: string
    subjectCode?: string
    achievementAwardDate?: string
    credits?: string
    source?: string
    dateLoaded?: string
    underDataChallenge?: string
    level?: string
    status?: string
    subject?: string
    grade?: string
    awardingOrganisationUkprn?: string
    collectionType?: string
    returnNumber?: string
    participationStartDate?: string
    participationEndDate?: string
    languageForAssessment?: string
  }
}
