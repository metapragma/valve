import { tester } from '../util/tester'

import {
  IStreamThrough,
  StreamAbort,
  StreamCallback,
  StreamType,
} from '../types'

export function filter <P, K extends keyof P, E = Error>(test: K): IStreamThrough<P, P, E>
export function filter <P, E = Error>(test: RegExp): IStreamThrough<P, P, E>
// tslint:disable-next-line unified-signatures
export function filter <P, E = Error>(test: ((data: P) => boolean)): IStreamThrough<P, P, E>
export function filter <P, K extends keyof P, E = Error>(test: RegExp | K | ((data: P) => boolean)): IStreamThrough<P, P, E> {
  const t = tester(test)

  return {
    type: StreamType.Through,
    sink (source) {
      // tslint:disable-next-line no-function-expression
       
      function next (end: StreamAbort<E>, cb: StreamCallback<P, E>) {

        let sync: boolean
        let loop = true

        while (loop) {
          loop = false
          sync = true

          // tslint:disable-next-line no-shadowed-variable
          source.source(end, (end, data) => {
            if (!end && !t(data)) return sync ? (loop = true) : next(end, cb)
            cb(end, data)
          })

          sync = false
        }
      }

      return {
        type: StreamType.Source,
        source: next 
      }
    }
  }
}
