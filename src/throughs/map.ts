import { ValveError, ValveThroughFactory } from '../types'

import { createThrough } from '../utilities'

export function map<P, R, E = ValveError>(
  iteratee: ((data: P) => R)
): ValveThroughFactory<P, R, {}, E> {
  return createThrough(({ data }) => ({
    onData(payload) {
      data(iteratee(payload))
    }
  }))
}
