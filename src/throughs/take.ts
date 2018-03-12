// tslint:disable no-conditional-assignment no-shadowed-variable

import { ValveActionType, ValveError, ValveThrough } from '../types'

import { createThrough } from '../utilities'

import { isNumber } from 'lodash'

// read a number of items and then stop.
export function take<P, E = ValveError>(
  predicate: number | ((data: P) => boolean),
  last: boolean = false
): ValveThrough<P, P, E> {
  let _last: boolean = last
  // let ended: ValveAction<P, E>
  let tester: (data: P) => boolean

  if (isNumber(predicate)) {
    let n = predicate

    if (n <= 0) {
      _last = false
      n = 0
    } else {
      _last = true
    }

    tester = () => {
      if (n === 0) return false

      n -= 1

      return n > 0
    }
  } else {
    tester = predicate
  }

  let ended: boolean = false

  // tslint:disable-next-line no-unnecessary-local-variable
  const through = createThrough<P, P, E>({
    up: {
      onPull(action, cb, source) {
        if (ended) {
          source.source({ type: ValveActionType.Abort }, cb)
        } else {
          source.source(action, cb)
        }
      }
    },
    down: {
      onData(action, cb) {
        ended = ended || !tester(action.payload)

        if (ended) {
          if (_last) {
            cb(action)
          } else {
            cb({ type: ValveActionType.Abort })
          }
        } else {
          cb(action)
        }
      }
    }
  })

  return through
}
