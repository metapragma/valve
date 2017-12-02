import {
  isRegExp
} from 'lodash'

// type PropReturn<F, P, K extends keyof P> =

import {
  ValveCallback
} from '../types'

export function prop <P, K, F>(key?: any): (data: any) => any
export function prop (): void
export function prop <P, F>(key?: (data: P) => F): (data: P) => F
export function prop (key?: RegExp): (data: string) => string | void
export function prop <P, K extends keyof P>(key?: K): ((data: P) => P[K])
export function prop <P, K extends keyof P, F>(key?: K | RegExp | ((data: P) => F)): void | ((data: P | string) => F | P[K] | string | void)
{
  if (typeof key === 'string') {
    return (data: P) => {
      return data[key]
    }
  } else if (isRegExp(key)) {
    return (data: string) => {
      const v = key.exec(data)

      return v && v[0]
    }
  } else if (key) {
    return key
  }
}
