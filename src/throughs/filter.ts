import { ValveError, ValveThroughFactory } from '../types'

import { createThrough } from '../index'

export function filter<P, E extends ValveError = ValveError>(
  predicate: ((next: P) => boolean)
): ValveThroughFactory<P, P, {}, E> {
  return createThrough<P, P, {}, E>(({ next, noop }) => ({
    next(payload) {
      if (predicate(payload)) {
        next(payload)
      } else {
        noop()
      }
    }
  }))
}
