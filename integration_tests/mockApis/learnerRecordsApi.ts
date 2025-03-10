import { stubFor } from './wiremock'

const learnerRecordsPing = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/health/ping',
    },
    response: {
      status: 200,
    },
  })

export default {
  stubLearnerRecordsHealth: learnerRecordsPing,
}
