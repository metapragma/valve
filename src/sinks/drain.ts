import { ValveError, ValveSinkFactory } from '../types'

import { createSink } from '../internal/createSink'

export function drain<P, E extends ValveError = ValveError>(): ValveSinkFactory<
  P,
  P,
  {},
  E
> {
  return createSink<P, P, {}, E>(({ next, complete, error }) => ({
    next(value) {
      next(value)
    },
    complete() {
      complete()
    },
    error(value) {
      error(value)
    }
  }))
}
