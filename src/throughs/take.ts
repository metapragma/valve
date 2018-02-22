// tslint:disable no-conditional-assignment no-shadowed-variable

import { ValveAbort, ValveCallback, ValveThrough, ValveType } from '../types'

import { defaults, isNumber } from 'lodash'

import { isDataAvailable } from '../util/isDataAvailable'

import { hasEnded } from '../util/hasEnded'

// read a number of items and then stop.
export function take<P, E = Error>(
  test: number | ((data: P) => boolean),
  options?: { last?: boolean }
): ValveThrough<P, P, E> {
  const opts = defaults({}, options, { last: false })
  defaults(opts)

  let last = opts.last // whether the first item for which !test(item) should still pass
  let ended: ValveAbort<E> | false = false
  let tester: (data: P) => boolean

  if (isNumber(test)) {
    let n = test

    if (n <= 0) {
      last = false
      n = 0
    } else {
      last = true
    }

    tester = () => {
      if (n === 0) return false

      n -= 1

      return n > 0
    }
  } else {
    tester = test
  }

  return {
    type: ValveType.Through,
    sink(source) {
      function terminate(cb: ValveCallback<P, E>) {
        source.source(true, err => {
          last = false
          cb(err || true)
        })
      }

      return {
        type: ValveType.Source,
        source(end: ValveAbort<E>, cb: ValveCallback<P, E>) {
          if (ended) {
            last ? terminate(cb) : cb(ended)
          } else if ((ended = end)) {
            source.source(ended, cb)
          } else {
            source.source(false, (end, data) => {
              if ((ended = ended || hasEnded(end))) {
                cb(ended)
              } else if (isDataAvailable(end, data) && !tester(data)) {
                ended = true
                last ? cb(false, data) : terminate(cb)
              } else {
                cb(false, data)
              }
            })
          }
        }
      }
    }
  }
}
