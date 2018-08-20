import { ValveError, ValveThroughFactory } from '../types'

import { createThrough } from '../index'

export function map<P, R, E extends ValveError = ValveError>(
  iteratee: ((next: P) => R)
): ValveThroughFactory<P, R, {}, E> {
  return createThrough(({ next }) => ({
    next(payload) {
      next(iteratee(payload))
    }
  }))
}
