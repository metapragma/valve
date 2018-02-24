import {
  ValveActionType,
  ValveError,
  ValveSourceAction,
  ValveThrough
} from '../types'

import { createThrough } from '../utilities'

export function filter<P, E = ValveError>(
  predicate: ((data: P) => boolean)
): ValveThrough<P, P, E> {
  return createThrough<P, P, E>({
    onData(action, cb, source) {
      let loop: boolean = true
      let reference: ValveSourceAction<P, E> = action

      while (loop) {
        if (
          reference.type === ValveActionType.Data &&
          !predicate(reference.payload)
        ) {
          // tslint:disable-next-line no-parameter-reassignment
          source.source({ type: ValveActionType.Pull }, a => {
            reference = a
          })
        } else {
          loop = false
          cb(reference)
        }
      }
    }
  })
}
