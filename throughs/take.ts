// tslint:disable no-conditional-assignment no-shadowed-variable

import {
  IStreamThrough,
  StreamAbort,
  StreamCallback,
  StreamType
} from '../types'

export type TakeTest<P> = (data: P) => void | boolean | number

// read a number of items and then stop.
export function take<P, E = Error>(
  test: number | TakeTest<P>,
  opts?: { last?: boolean }
): IStreamThrough<P, P, E> {
  opts = opts || {}
  let last = opts.last || false // whether the first item for which !test(item) should still pass
  let ended: StreamAbort<E> = false
  let tester: TakeTest<P>

  if (typeof test === 'number') {
    last = true

    let n = test
    tester = () => {
      // tslint:disable-next-line no-increment-decrement
      return --n
    }
  } else {
    tester = test
  }

  return {
    type: StreamType.Through,
    sink(source) {
      function terminate(cb: StreamCallback<P, E>) {
        source.source(true, err => {
          last = false
          cb(err || true)
        })
      }

      return {
        type: StreamType.Source,
        source(end: StreamAbort<E>, cb: StreamCallback<P, E>) {
          if (ended) last ? terminate(cb) : cb(ended)
          else if ((ended = end)) source.source(ended, cb)
          else {
            source.source(null, (end, data) => {
              if ((ended = ended || end)) {
                // last ? terminate(cb) :
                cb(ended)
              } else if (!tester(data)) {
                ended = true
                last ? cb(null, data) : terminate(cb)
              } else {
                cb(null, data)
              }
            })
          }
        }
      }
    }
  }
}
