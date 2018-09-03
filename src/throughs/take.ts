// tslint:disable no-conditional-assignment no-shadowed-variable

import { ValveError } from '../types'

import { Through } from '../internal/Through'

import { isNumber } from 'lodash'

// read a number of items and then stop.
export function take<P, E extends ValveError = ValveError>(
  predicate: number | ((next: P) => boolean),
  last: boolean = false
): Through<P, P, E> {
  let _last: boolean = last
  // let ended: ValveMessage<P, E>
  let tester: (next: P) => boolean

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

  return Through.create<P, P, E>(
    ({ next, complete }) => ({
      next(payload) {
        ended = ended || !tester(payload)

        if (ended) {
          if (_last) {
            next(payload)
          } else {
            complete()
          }
        } else {
          next(payload)
        }
      }
    }),
    ({ complete, pull }) => ({
      pull() {
        if (ended) {
          complete()
        } else {
          pull()
        }
      }
    })
  )
}
