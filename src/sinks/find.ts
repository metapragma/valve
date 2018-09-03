import { identity } from 'lodash'

import { ValveError, ValveSinkFactory } from '../types'

import { Sink } from '../internal/Sink'

// Sinks

export function find<P, E extends ValveError = ValveError>(
  predicate: (next: P) => boolean = identity
): ValveSinkFactory<P, P, {}, E> {
  let ended = false

  return Sink.of<P, P, {}, E>(({ next, complete, error }, terminate) => ({
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
