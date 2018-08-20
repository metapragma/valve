import { ValveError, ValveSinkFactory } from '../types'

import { defaults, isUndefined } from 'lodash'

import { createSink } from '../index'

export function drain<P, E extends ValveError = ValveError>(): ValveSinkFactory<
  P,
  P,
  {},
  E
> {
  return createSink<P, P, {}, E>(({ observer }) => ({
    next(value) {
      observer.next(value)
    },
    complete() {
      observer.complete()
    },
    error(value) {
      observer.error(value)
    }
  }))
}
