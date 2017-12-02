import { abortCb } from '../util/abort-cb'

import {
  ValveSource,
  ValveError,
  ValveType,
} from '../types'

export function once <P, E = Error>(
  value: P,
  onAbort?: (abort: ValveError<E>) => void
): ValveSource<P, E> {
  let localValue = value

  return {
    type: ValveType.Source,
    source (abort, cb) {
      if (abort) return abortCb(cb, abort, onAbort)

      if (localValue != null) {
        const _localValue = localValue
        localValue = null
        cb(null, _localValue)
      } else cb(true)
    }
  }
}
