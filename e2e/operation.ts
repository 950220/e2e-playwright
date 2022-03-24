import {TOpera} from "./types"
import {expect, Locator, Page} from "@playwright/test";

/* 做操作，例如赋值，点击等 */
async function operation(locator: Locator, opera: TOpera, page: Page): Promise<TOpera> {
  const begin = Date.now()
  switch (opera.operation) {
    case 'click':
      if (opera.position) {
        await locator.click({position: opera.position})
      } else {
        await locator.click()
      }
      break
    case 'input':
      await locator.type(opera.insertValue+'')
      break
    case 'scroll':
      await locator.scrollIntoViewIfNeeded()
      break
    case 'changePage':
      // TODO：判断页面标题合法性
      break
    case 'returnUrl':
      await page.goto(`${opera.value}`)
      break
    case 'finish':
      console.log('最后一步，完成😁😁')
      // await page.close();
      break
  }
  return opera
}

export default operation
