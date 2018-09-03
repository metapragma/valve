import { identity } from 'lodash'

import { ValveError } from '../types'

import { Sink } from '../internal/Sink'

// Sinks

export function find<P, E extends ValveError = ValveError>(
  predicate: (next: P) => boolean = identity
): Sink<P, P, E> {
  let ended = false

  return Sink.create(({ next, complete, error }, terminate) => ({
    next(value) {
      // tslint:disable-next-line strict-boolean-expressions
      if (predicate(value)) {
        ended = true

        next(value)
        complete()

        terminate.complete()
      }
    },
    error(value) {
      if (!ended) {
        error(value)
      }
    },
    complete() {
      if (!ended) {
        complete()
      }
    }
  }))
}
