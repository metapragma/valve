import { ValveError, ValveThroughFactory } from '../types'

import { Through } from '../internal/Through'

export function asyncMap<P, R, E extends ValveError = ValveError>(
  iteratee: (next: P) => Promise<R>
): ValveThroughFactory<P, R, {}, E> {
  return Through.of(({ next, error }) => ({
    next(payload) {
      iteratee(payload)
        .then(next)
        .catch(error)
    }
  }))
}
