import { identity } from 'lodash'

import { ValveError, ValveMessageType, ValveSinkFactory } from '../types'

import { createSink } from '../internal/createSink'

// Sinks

export function find<P, E extends ValveError = ValveError>(
  predicate: (next: P) => boolean = identity
): ValveSinkFactory<P, P, {}, E> {
  let ended = false

  return createSink<P, P, {}, E>(({ complete, observer }) => ({
    next(value) {
      // tslint:disable-next-line strict-boolean-expressions
      if (predicate(value)) {
        ended = true

        observer.next(value)
        observer.complete()

        complete()
      }
    },
    error(value) {
      if (!ended) {
        observer.error(value)
      }
    },
    complete() {
      if (!ended) {
        observer.complete()
      }
    }
  }))
}
