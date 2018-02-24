import { ValveActionType, ValveError, ValveSource } from '../types'

import { createSource } from '../utilities'

// a stream that errors immediately.

export function error<P, E = ValveError>(err: E): ValveSource<P, E> {
  return createSource<P, E>({
    onPull(_, cb) {
      cb({ type: ValveActionType.Error, payload: err })
    }
  })
}
