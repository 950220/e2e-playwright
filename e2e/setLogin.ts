import {BrowserContext} from "@playwright/test";

const cookies = {
  'spec': {
    value: 'f34962dd4df640838c05f57170d1144c9zCRN6',
  },
  'common': {
    value: 'f34962dd4df640838c05f57170d1144c9zCRN6',
  }
}

export default async function login(context: BrowserContext, domain: string, cookieType: 'common'|'spec'  = 'common') {
  console.log(cookieType)
  await context.addCookies([
    {
      name: 'wapToken',
      value: cookies[cookieType]?.value,
      domain,
      path: '/'
    },
  ])
}
