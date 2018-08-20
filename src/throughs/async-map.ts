import { ValveError, ValveThroughFactory } from '../types'

import { createThrough } from '../internal/createThrough'

export function asyncMap<P, R, E extends ValveError = ValveError>(
  iteratee: (next: P) => Promise<R>
): ValveThroughFactory<P, R, {}, E> {
  return createThrough(({ next, error }) => ({
    next(payload) {
      iteratee(payload)
        .then(next)
        .catch(error)
    }
  }))
}
