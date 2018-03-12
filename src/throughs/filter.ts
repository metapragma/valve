import { ValveActionType, ValveError, ValveThrough } from '../types'

import { createThrough } from '../utilities'

export function filter<P, E = ValveError>(
  predicate: ((data: P) => boolean)
): ValveThrough<P, P, E> {
  return createThrough<P, P, E>({
    down: {
      onData(action, cb) {
        if (predicate(action.payload)) {
          cb(action)
        } else {
          cb({ type: ValveActionType.Noop })
        }
      }
    }
  })
}
