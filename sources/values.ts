import {
  StreamAbort,
  StreamSource
} from '../types'

import {
  isArray,
  values as _values
} from 'lodash'

import { abortCb } from '../util/abort-cb'

export function values <P, E = Error>(
  input: P[],
  onAbort?: (abort: StreamAbort<E>) => void
): StreamSource<P, E>

export function values <P, K extends keyof P, E = Error>(
  input: P,
  onAbort?: (abort: StreamAbort<E>) => void
): StreamSource<P[K], E>

export function values <P, K extends keyof P, E = Error>(
  input: P,
  onAbort?: (abort: StreamAbort<E>) => void
): StreamSource<P[K], E> {
  if (typeof input === 'undefined') {
    return (abort, cb) => {
      if (abort) return abortCb(cb, abort, onAbort)

      return cb(true)
    }
  }

  const array: P[K][] = _values(input)

  let i = -1

  return (abort, cb) => {
    if (abort) return abortCb(cb, abort, onAbort)
    if (i >= array.length - 1) cb(true)
    else {
      cb(null, array[i+=1])
    }
  }
}
