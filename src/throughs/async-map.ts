import { ValveError } from '../types'

import { Through } from '../internal/Through'

export function asyncMap<P, R, E extends ValveError = ValveError>(
  iteratee: (next: P) => Promise<R>
): Through<P, R, E> {
  return Through.create(({ next, error }) => ({
    next(payload) {
      iteratee(payload)
        .then(next)
        .catch(error)
    }
  }))
}
