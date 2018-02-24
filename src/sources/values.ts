import {
  ValveActionAbort,
  ValveActionData,
  ValveActionError,
  ValveActionType,
  ValveError,
  ValveSource
} from '../types'

import { createSource } from '../utilities'

export function values<P, E = ValveError>(
  iterable: Iterable<P>
): ValveSource<P, E> {
  const iterator = iterable[Symbol.iterator]()

  const next = ():
    | ValveActionError<E>
    | ValveActionData<P>
    | ValveActionAbort => {
    try {
      const { value, done } = iterator.next()

      if (done) {
        return { type: ValveActionType.Abort }
      } else {
        return {
          type: ValveActionType.Data,
          payload: value
        }
      }
    } catch (error) {
      return {
        type: ValveActionType.Error,
        payload: error as E
      }
    }
  }

  return createSource<P, E>({
    onPull(_, cb) {
      cb(next())
    }
  })
}
