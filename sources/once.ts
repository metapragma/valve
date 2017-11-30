import { abortCb } from '../util/abort-cb'

import {
  IStreamSource,
  StreamAbort,
  StreamType,
} from '../types'

export function once <P, E = Error>(
  value: P,
  onAbort?: (abort: StreamAbort<E>) => void
): IStreamSource<P, E> {
  let localValue = value

  return {
    type: StreamType.Source,
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
