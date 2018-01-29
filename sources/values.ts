import { ValveError, ValveSource, ValveType } from '../types'

import { values as _values } from 'lodash'

import { abortCb } from '../util/abort-cb'

export function values<P, E = Error>(
  input: P[],
  onAbort?: (abort: ValveError<E>) => void
): ValveSource<P, E>

export function values<P, K extends keyof P, E = Error>(
  input: P,
  onAbort?: (abort: ValveError<E>) => void
): ValveSource<P[K], E>

export function values<P, K extends keyof P, E = Error>(
  input: P,
  onAbort?: (abort: ValveError<E>) => void
): ValveSource<P[K], E> {

  const array: P[K][] = _values(input)

  let i = -1

  return {
    type: ValveType.Source,
    source(abort, cb) {
      if (abort) return abortCb(cb, abort, onAbort)
      if (i >= array.length - 1) cb(true)
      else {
        cb(false, array[(i += 1)])
      }
    }
  }
}
