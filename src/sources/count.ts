import { ValveActionType, ValveError, ValveSource } from '../types'

import { createSource } from '../utilities'

export function count<E = ValveError>(max = Infinity): ValveSource<number, E> {
  let i = 0

  return createSource<number, E>({
    onPull(_, cb) {
      if (i >= max) {
        cb({ type: ValveActionType.Abort })
      } else {
        cb({
          type: ValveActionType.Data,
          payload: (i += 1)
        })
      }
    }
  })
}
