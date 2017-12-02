import { tester } from '../util/tester'

import {
  ValveThrough,
  ValveAbort,
  ValveCallback,
  ValveType,
} from '../types'

export function filter <P, K extends keyof P, E = Error>(test: K): ValveThrough<P, P, E>
export function filter <P, E = Error>(test: RegExp): ValveThrough<P, P, E>
// tslint:disable-next-line unified-signatures
export function filter <P, E = Error>(test: ((data: P) => boolean)): ValveThrough<P, P, E>
export function filter <P, K extends keyof P, E = Error>(test: RegExp | K | ((data: P) => boolean)): ValveThrough<P, P, E> {
  const t = tester(test)

  return {
    type: ValveType.Through,
    sink (source) {
      // tslint:disable-next-line no-function-expression

      function next (end: ValveAbort<E>, cb: ValveCallback<P, E>) {

        let sync: boolean
        let loop = true

        while (loop) {
          loop = false
          sync = true

          // tslint:disable-next-line no-shadowed-variable
          source.source(end, (end, data) => {
            if (!end && !t(data)) {
              return sync
                ? (loop = true)
                : next(end, cb)
            }
            cb(end, data)
          })

          sync = false
        }
      }

      return {
        type: ValveType.Source,
        source: next 
      }
    }
  }
}
