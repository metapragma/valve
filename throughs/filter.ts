import { tester } from '../util/tester'

import {
  StreamThrough
} from '../types'

export function filter <P, K extends keyof P, E = Error>(test: K): StreamThrough<P, P, E>
export function filter <P, E = Error>(test: RegExp): StreamThrough<P, P, E>
// tslint:disable-next-line unified-signatures
export function filter <P, E = Error>(test: ((data: P) => boolean)): StreamThrough<P, P, E>
export function filter <P, K extends keyof P, E = Error>(test: RegExp | K | ((data: P) => boolean)): StreamThrough<P, P, E> {
  const t = tester(test)

  return read => {
    // tslint:disable-next-line no-function-expression
    return function next (end, cb) {

      let sync: boolean
      let loop = true

      while (loop) {
        loop = false
        sync = true

        // tslint:disable-next-line no-shadowed-variable
        read(end, (end, data) => {
          if (!end && !t(data)) return sync ? (loop = true) : next(end, cb)
          cb(end, data)
        })

        sync = false
      }
    }
  }
}
