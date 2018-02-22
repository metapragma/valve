import { abortCb } from '../util/abort-cb'

import { ValveError, ValveSource, ValveType } from '../types'

export function once<P, E = Error>(
  value: P,
  onAbort?: (abort: ValveError<E>) => void
): ValveSource<P, E> {
  let triggered: boolean = false

  return {
    type: ValveType.Source,
    source(abort, cb) {
      if (abort) return abortCb(cb, abort, onAbort)

      if (triggered === false) {
        triggered = true
        cb(false, value)
      } else cb(true)
    }
  }
}
