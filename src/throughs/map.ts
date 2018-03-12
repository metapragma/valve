import { ValveActionType, ValveError, ValveThrough } from '../types'

import { createThrough } from '../utilities'

export function map<P, R, E = ValveError>(
  iteratee: ((data: P) => R)
): ValveThrough<P, R, E> {
  return createThrough({
    down: {
      onData(action, cb) {
        cb({
          type: ValveActionType.Data,
          payload: iteratee(action.payload)
        })
      }
    }
  })
}
