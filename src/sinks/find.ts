import { identity } from 'lodash'

import { ValveError, ValveSinkFactory } from '../types'

import { createSink } from '../internal/createSink'

// Sinks

export function find<P, E extends ValveError = ValveError>(
  predicate: (next: P) => boolean = identity
): ValveSinkFactory<P, P, {}, E> {
  let ended = false

  return createSink<P, P, {}, E>(({ next, complete, error }, terminate) => ({
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
