import { ValveError } from '../types'

import { Through } from '../internal/Through'

export function map<P, R, E extends ValveError = ValveError>(
  iteratee: ((next: P) => R)
): Through<P, R, E> {
  return Through.create(({ next }) => ({
    next(payload) {
      next(iteratee(payload))
    }
  }))
}
