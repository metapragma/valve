import {
  ValveError,
  ValveSinkFactory
} from '../types'

import { defaults, isUndefined } from 'lodash'

import { createSink } from '../utilities'

export function reduce<P, R = P, E extends ValveError = ValveError>(
  iteratee: (accumulator: R, next: P) => R,
  accumulator?: R
): ValveSinkFactory<P, R, {}, E> {
  let first = true
  // tslint:disable-next-line no-any
  let acc: any = accumulator

  return createSink<P, R, {}, E>(({ observer }) => ({
    next(value) {
      if (first && isUndefined(accumulator)) {
        acc = value
      } else {
        // tslint:disable-next-line no-unsafe-any
        acc = iteratee(acc, value)
      }

      first = false
    },
    complete() {
      if (first && isUndefined(accumulator)) {
        observer.complete()
      } else {
        // tslint:disable-next-line no-unsafe-any
        observer.next(acc)
        observer.complete()
      }
    },
    error(value) {
      observer.error(value)
    }
  }))
}
