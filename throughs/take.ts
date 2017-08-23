// tslint:disable no-conditional-assignment no-shadowed-variable

import {
  StreamAbort,
  StreamCallback,
  StreamThrough
} from '../types'

type TakeTest<P> = (data: P) => void | boolean | number

// read a number of items and then stop.
export function take<P, E = Error>(
  test: number | TakeTest<P>,
  opts?: { last?: boolean }
): StreamThrough<P, P, E> {
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

  return read => {
    function terminate(cb: StreamCallback<P, E>) {
      read(true, err => {
        last = false
        cb(err || true)
      })
    }

    return (end: StreamAbort<E>, cb: StreamCallback<P, E>) => {
      if (ended) last ? terminate(cb) : cb(ended)
      else if ((ended = end)) read(ended, cb)
      else {
        read(null, (end, data) => {
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
