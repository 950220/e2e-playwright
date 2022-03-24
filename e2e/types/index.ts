import { Reporter, TestError, TestResult, FullResult, TestStep, TestCase } from '@playwright/test/reporter';
import {ObjectId} from "mongodb";

export type TOpera = {
  operation?: string
  findType?: string
  iframeValue?: string
  value: number | string
  step: number | string
  insertValue?: number | string
  text?: string
  tip:  string
  number?: number | string
  beforeWaite?: number
  maxWaiteTime?: number
  position?: {
    x: number,
    y: number,
  }
}

export type TMessage = {
  type:  'onBegin' | 'onTestBegin' | 'onTestEnd'  | 'onEnd' | 'onError' | 'onStepEnd',
  data: {
    message: string
    date: number,
    config?: any,
    suite?: any,
    len?:  number,
    test?: TestCase
    result?: TestResult | FullResult,
    error?: TestError,
    step?: TestStep,
    pageInfo?: {url: string}
    stepList?: any[]
  },
  success: boolean
}


export type TTestItem = {
  result: boolean, // 测试结果
  title: string, // 渠道名称
  start: number,
  end: number
  url: string,
  failStepTip: string // 失败的步骤
  testId?: ObjectId // 存储的数据库
}

export type TTest = {
  start: number,
  end: number
  testResult: boolean, // 测试结果
  tests: TTestItem[] // 测试的渠道
}
