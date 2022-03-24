/* 文件生成器 */
const path = require('path')
const fs = require('fs')
const files = fs.readdirSync(path.resolve(__dirname,'./channels'))


const base = (fileName: string) => `import {test, expect, Locator, Page} from "@playwright/test";
// @ts-ignore
import channels from "../channels/${fileName}";
import login from '../setLogin'
import operation from '../operation'
import finElement from "../findElement";

const {messages, steps} = channels
test(messages.name, async ({browser}, testInfo) => {
  await testInfo.attach('pageInfo', {
      body: JSON.stringify(messages)
    })
  const context = await browser.newContext()
  await login(context, messages.domain, messages.cookieType)
  let newPage: Page = await context.newPage()
  await newPage.goto(messages.url)

  for (const opera of steps) {
   await testInfo.attach('step', {
      body: JSON.stringify(opera)
    })
    const {page, locator}: {locator: Locator, page: Page} = await finElement(newPage, opera, context)
    newPage = page // 覆盖page
    await operation(locator, opera, page)
  }
  expect(newPage)
})`

files.forEach((file: string) => {
  console.log(file)
  fs.writeFile(path.resolve(__dirname, `./tests/${file}`.replace('.ts', '.spec.ts')), base(file), (e: any) => {
    e && console.error(e)
  })
})
