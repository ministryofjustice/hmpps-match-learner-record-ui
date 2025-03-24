import { SuperAgentRequest } from 'superagent'
import stubPing from './common'
import { stubFor } from './wiremock'
import learnerEvents from '../mockData/learnerEvents'

const stubNoMatchForAll = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/match/.*',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        matchedUln: '',
        givenName: '',
        familyName: '',
        status: 'NoMatch',
      },
    },
  })

const stubLearnerEventsExactMatch = (
  givenName: string = 'Darcie',
  familyName: string = 'Tucker',
  uln: string = '1026893096',
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/learner-events',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        searchParameters: { givenName, familyName, uln },
        responseType: 'Exact Match',
        foundUln: uln,
        incomingUln: uln,
        learnerRecord: [...learnerEvents],
      },
    },
  })

const stubLearnerResultsPossibleMatch = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/learners',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        searchParameters: {
          givenName: 'Darcie',
          familyName: 'Tucker',
          dateOfBirth: '1976-08-16',
          gender: 'NOT_KNOWN',
          lastKnownPostCode: 'ZZ99 9ZZ',
        },
        responseType: 'Possible Match',
        mismatchedFields: { gender: ['FEMALE'], lastKnownPostCode: ['CV4 9EE'] },
        matchedLearners: [
          {
            createdDate: '2012-05-25',
            lastUpdatedDate: '2012-05-25',
            uln: '1026893096',
            versionNumber: '1',
            title: 'Mr',
            givenName: 'John',
            middleOtherName: '',
            familyName: 'Doe',
            preferredGivenName: 'John',
            schoolAtAge16: 'Hill School Foundation',
            lastKnownAddressLine1: '1 JOBS LANE',
            lastKnownAddressTown: 'COVENTRY',
            lastKnownAddressCountyOrCity: 'WEST MIDLANDS',
            lastKnownPostCode: 'CV4 9EE',
            dateOfAddressCapture: '2009-04-25',
            dateOfBirth: '1976-08-16',
            placeOfBirth: 'Blean ',
            gender: 'FEMALE',
            emailAddress: 'john.smith@aol.compatibilitytest.com',
            scottishCandidateNumber: '845759406',
            abilityToShare: '1',
            learnerStatus: '1',
            verificationType: '1',
            tierLevel: '0',
          },
        ],
      },
    },
  })

export default {
  stubNoMatchForAll,
  stubLearnerEventsExactMatch,
  stubLearnerResultsPossibleMatch,
  stubLearnerRecordsHealth: stubPing(),
}
