import { ValveError, ValveSinkFactory } from '../types'

import { Sink } from '../internal/Sink'

export function drain<P, E extends ValveError = ValveError>(): ValveSinkFactory<
  P,
  P,
  {},
  E
> {
  return Sink.of<P, P, {}, E>(({ next, complete, error }) => ({
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
