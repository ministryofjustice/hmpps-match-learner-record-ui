import { stubFor } from './wiremock'
import stubPing from './common'

const stubComponents = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: '/components/components\\?component=header&component=footer',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        header: {
          html: '<header data-qa="common-header">Common Components Header</header>',
          javascript: [],
          css: [],
        },
      },
    },
  })
}

const stubGetComponents = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: '/components',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        header: {
          html: '<header data-qa="common-header">Common Components Header</header>',
          javascript: [],
          css: [],
        },
      },
    },
  })
}

const stubComponentsFail = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/components/header',
    },
    response: {
      status: 500,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  })

export default {
  stubComponents,
  stubComponentsFail,
  stubGetComponents,
  stubFrontendComponentsPing: stubPing('components'),
}
