import { filter } from './filter'
import { tester } from '../util/tester'

import {
  IStreamThrough
} from '../types'

export function filterNot <P, K extends keyof P, E = Error>(test: K): IStreamThrough<P, P, E>
export function filterNot <P, E = Error>(test: RegExp): IStreamThrough<P, P, E>
// tslint:disable-next-line unified-signatures
export function filterNot <P, E = Error>(test: ((data: P) => boolean)): IStreamThrough<P, P, E>
export function filterNot <P, K extends keyof P, E = Error>(test: RegExp | K | ((data: P) => boolean)): IStreamThrough<P, P, E> {
  const t = tester(test)

  return filter(data => {
    return !t(data)
  })
}
