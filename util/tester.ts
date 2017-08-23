import { isRegExp } from 'lodash'
import { id } from './id'
import { prop } from './prop'

export function tester (test?: any): (data: any) => any
export function tester <P>(): (data: P) => P
export function tester (test?: RegExp): (data: string) => boolean
export function tester <P, K extends keyof P>(test?: K): (data: P) => P[K]
export function tester <P, F>(test?: (data: P) => F): (data: P) => F
export function tester <P, K extends keyof P, F>(test?: RegExp | K | ((data: P) => F)): (data: P | string) => F | boolean | P[K] | P {
  if (isRegExp(test)) {
    return (data: string) => {
      return test.test(data)
    }
  } else {
    return prop(test) || id
  }
}
