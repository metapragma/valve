import { ValveError, ValveThroughFactory } from '../types'

import { createThrough } from '../utilities'

export function filter<P, E = ValveError>(
  predicate: ((data: P) => boolean)
): ValveThroughFactory<P, P, E> {
  return createThrough<P, P, E>(({ data, noop }) => ({
    onData(payload) {
      if (predicate(payload)) {
        data(payload)
      } else {
        noop()
      }
    }
  }))
}
