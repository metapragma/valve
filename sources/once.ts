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
  return {
    type: StreamType.Source,
    source (abort, cb) {
      if (abort) return abortCb(cb, abort, onAbort)
      if (value != null) {
        const _value = value
        value = null
        cb(null, _value)
      } else cb(true)
    }
  }
}