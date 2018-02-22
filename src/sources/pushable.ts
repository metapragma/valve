import {
  ValveAbort,
  ValveCallback,
  ValveError,
  ValveSource,
  ValveType
} from '../types'

import { isFunction } from 'lodash'

export function pushable<P, E = Error>(
  onDone?: (abort: ValveError<E>) => void
): {
  source: ValveSource<P, E>
  end: (e?: ValveError<E>) => void
  push: (data: P) => void
} {
  // create a buffer for data that have been pushed but not yet pulled.
  const buffer: P[] = []

  // a pushable is a source stream (abort, cb) => cb(end, data)
  //
  // when pushable is pulled, keep references to abort and cb so we can call
  // back after
  // end(end) or push(data)

  let abort: ValveAbort<E> = false
  let cb: ValveCallback<P, E> | false
  let ended: ValveAbort<E> = false

  // `callback` calls back to waiting sink, and removes references to sink cb.
  const callback = (err: ValveAbort<E>, val?: P): void => {
    const _cb = cb
    // if error and pushable passed onDone, call it the first time this stream
    // ends or errors.
    if (err && isFunction(onDone)) {
      const c = onDone
      // tslint:disable-next-line no-parameter-reassignment
      onDone = undefined
      c(err === true ? false : err)
    }

    cb = false
    if (_cb) {
      _cb(err, val)
    }
  }

  // `drain` calls back to (if any) waiting sink with abort, end, or next data.
  const drain = (): void => {
    if (!cb) return

    if (abort) callback(abort)
    else if (buffer.length === 0 && ended) callback(ended)
    else if (buffer.length !== 0) callback(false, buffer.shift())
  }

  const source: ValveSource<P, E> = {
    type: ValveType.Source,
    source(_abort, _cb) {
      if (_abort) {
        abort = _abort
        // if there is already a cb waiting, abort it.
        if (cb) callback(abort)
      }
      cb = _cb
      drain()
    }
  }

  const end = (_end: ValveAbort<E> = false): void => {
    ended = ended || _end || true
    // attempt to drain
    drain()
  }

  const push = (data: P): void => {
    if (ended) return
    // if sink already waiting, we can call back directly.
    if (cb) {
      callback(abort, data)

      return
    }
    // otherwise push data and attempt to drain
    buffer.push(data)
  }

  return { push, end, source }
}
