import { ValveActionType, ValveError, ValveSource } from '../types'

import { createSource } from '../utilities'

export function once<P, E = ValveError>(value: P): ValveSource<P, E> {
  let triggered: boolean = false

  return createSource<P, E>({
    onPull(_, cb) {
      if (triggered === false) {
        triggered = true
        cb({
          type: ValveActionType.Data,
          payload: value
        })
      } else {
        cb({ type: ValveActionType.Abort })
      }
    }
  })
}
