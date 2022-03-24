import { Reporter, TestError, TestResult, FullResult, TestStep, TestCase,FullConfig,Suite } from '@playwright/test/reporter';
import WXRoobt from "./helps/WXRoobt";
import postToWX from "./helps/WXRoobt";
import {TMessage, TTest} from "./types";
import formatReportData from '../e2e/helps/formatReportData'
import InsertDb from "./store/insertDb";
const insertDb = new InsertDb()
let memoryList: any = []

function memory(data: TMessage) {
  memoryList.push(data)
  // console.log('data', data)
}
async function  report() {
  console.log('---上报到企业微信或哪里----')
  const test: TTest = formatReportData(memoryList)
  // 上报到企业微信或哪里
  // await postToWX(test)
  // await insertDb.insertResult(test) // 存储到数据库
}

class MyReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    memoryList = []
    memory({
      type: 'onBegin',
      data: {
        message: `Starting the run with ${suite.allTests().length} tests`,
        date: new Date().getTime(),
        config,
        suite,
        len: suite.allTests().length,
      },
      success: true
    })
  }

  onTestBegin(test: TestCase) {
    memory({
      type: 'onTestBegin',
      data: {
        message: `Starting test ${test.title}`,
        date: new Date().getTime(),
        test
      },
      success: true
    })
  }

  onTestEnd(test: TestCase, result: TestResult) {
   const stepList:any = []
   let pageInfo:any = {}
    try {
      result.attachments.filter(i => i.name === 'step').forEach(item => {
        // @ts-ignore
        stepList.push(JSON.parse(item.body.toString()))
      })
      // @ts-ignore
      pageInfo = JSON.parse(result.attachments.find(i => i.name === 'pageInfo')?.body.toString())
    } catch (e) {

    }


    memory({
      type: 'onTestEnd',
      data: {
        message: `Finished test ${test.title},${result.status}`,
        date: new Date().getTime(),
        test,
        result,
        pageInfo: pageInfo,
        stepList: stepList
      },
      success: result.status === 'passed'
    })
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    if ( result.status !== 'passed' && result.status !== 'skipped') {
      memory({
        type: 'onStepEnd',
        data: {
          message: `onStepEnd test ${test.title},${result.status}`,
          date: new Date().getTime(),
          test,
          result,
          step
        },
        success: false
      })
    }
  }

  onError(error: TestError) {
    memory({
      type: 'onError',
      data: {
        message: `onError test ${error.message}, ${error.value}`,
        date: new Date().getTime(),
        error
      },
      success: false
    })
  }

  async onEnd(result: FullResult) {
    memory({
      type: 'onEnd',
      data: {
        message: `onEnd test ${result.status}`,
        date: new Date().getTime(),
        result
      },
      success: result.status === 'passed'
    })
    await report()
  }
}
export default MyReporter;
