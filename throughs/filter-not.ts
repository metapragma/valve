import { filter } from './filter'
import { tester } from '../util/tester'

import {
  StreamThrough
} from '../types'

export function filterNot <P, K extends keyof P, E = Error>(test: K): StreamThrough<P, P, E>
export function filterNot <P, E = Error>(test: RegExp): StreamThrough<P, P, E>
// tslint:disable-next-line unified-signatures
export function filterNot <P, E = Error>(test: ((data: P) => boolean)): StreamThrough<P, P, E>
export function filterNot <P, K extends keyof P, E = Error>(test: RegExp | K | ((data: P) => boolean)): StreamThrough<P, P, E> {
  const t = tester(test)

  return filter(data => {
    return !t(data)
  })
}
