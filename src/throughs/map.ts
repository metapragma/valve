import { ValveError, ValveThroughFactory } from '../types'

import { Through } from '../internal/Through'

export function map<P, R, E extends ValveError = ValveError>(
  iteratee: ((next: P) => R)
): ValveThroughFactory<P, R, {}, E> {
  return Through.of(({ next }) => ({
    next(payload) {
      next(iteratee(payload))
    }
  }))
}
