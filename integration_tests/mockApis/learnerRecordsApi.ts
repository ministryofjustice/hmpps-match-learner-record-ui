import { stubFor } from './wiremock'

const ping = () =>
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
  stubAuthPing: ping,
}
