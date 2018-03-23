import { ValveActionType, ValveError, ValveThrough } from '../types'

import { createThrough } from '../utilities'

export function asyncMap<P, R, E = ValveError>(
  iteratee: (data: P) => Promise<R>
): ValveThrough<P, R, E> {
  return createThrough({
    down: {
      onData(action, cb) {
        iteratee(action.payload)
          .then(payload => {
            cb({
              type: ValveActionType.Data,
              payload
            })
          })
          .catch(payload => {
            cb({ type: ValveActionType.Error, payload: payload as E })
          })
      }
    }
  })
}
