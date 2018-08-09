import { ValveError, ValveThroughFactory } from '../types'

import { createThrough } from '../utilities'

export function asyncMap<P, R, E = ValveError>(
  iteratee: (data: P) => Promise<R>
): ValveThroughFactory<P, R, {}, E> {
  return createThrough(({ data, error }) => ({
    onData(payload) {
      iteratee(payload)
        .then(data)
        .catch(error)
    }
  }))
}
