import {Page, Locator, BrowserContext} from "@playwright/test";
import {TOpera} from "./types"


function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function finElement (page: Page, opera: TOpera, context: BrowserContext): Promise<{page: any, locator: any}>  {
  // opera.beforeWaite && await sleep(opera.beforeWaite)
  console.log('========>', opera.findType)
  switch (opera.findType) {
    case 'xpath':
      return {locator: page.locator(`${opera.value}`), page}
    case 'class':
      console.log('class')
      return {locator: page.locator(`.${opera.value}`), page}
    case 'id':
      console.log('id')
      return {locator: page.locator(`#${opera.value}`), page}
    case 'name':
      console.log('name')
      return {locator: page.locator(`name=${opera.value}`), page}
    case 'changePage':
      return new Promise((res, rej) => {
       context.on('page', async newPage => {
         console.log('changePage')
          await newPage.waitForLoadState();
          res({page: newPage, locator: newPage.locator(`/`)})
        })
      })
    case 'framenavigated':
      return new Promise((res, rej) => {
        page.on('framenavigated', async newPage => {
          console.log('framenavigated')
          await newPage.waitForLoadState();
          res({page: newPage, locator: newPage.locator(`/`)})
        })
      })
    case 'iframe':
      // @ts-ignore
      return {locator:page.frameLocator(opera.iframeValue).locator(opera.value+''), page}
    case 'returnUrl':
      return {locator: null, page}
    default:
      return {locator: page.locator(`/`), page}
  }
}

export default finElement
