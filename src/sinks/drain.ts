import { ValveError } from '../types'

import { Sink } from '../internal/Sink'

export function drain<P, E extends ValveError = ValveError>(): Sink<P, P, E> {
  return Sink.create<P, P, E>(({ next, complete, error }) => ({
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
