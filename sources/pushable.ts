import {
  ValveAbort,
  ValveCallback,
  ValveError,
  ValveSource,
  ValveType
} from '../types'

export function pushable <P, E = Error>(onDone?: (abort: ValveError<E>) => void): ({
  source: ValveSource<P, E>
  end: (e?: ValveError<E>) => void
  push: (data: P) => void
}) {
  // create a buffer for data
  // that have been pushed
  // but not yet pulled.
  const buffer: P[] = []

  // a pushable is a source stream
  // (abort, cb) => cb(end, data)
  //
  // when pushable is pulled,
  // keep references to abort and cb
  // so we can call back after
  // .end(end) or .push(data)

  let abort: ValveAbort<E>
  let cb: ValveCallback<P, E>
  let ended: ValveAbort<E>

  const source: ValveSource<P, E> = {
    type: ValveType.Source,
    source (_abort, _cb) {
      if (_abort) {
        abort = _abort
        // if there is already a cb waiting, abort it.
        if (cb) callback(abort)
      }
      cb = _cb
      drain()
    }
  }

  const end = (_end: ValveAbort<E>): void => {
    ended = ended || _end || true
    // attempt to drain
    drain()
  }

  const push = (data: P): void => {
    if (ended) return
    // if sink already waiting,
    // we can call back directly.
    if (cb) {
      callback(abort, data)

      return
    }
    // otherwise push data and
    // attempt to drain
    buffer.push(data)
    drain()
  }

  // `drain` calls back to (if any) waiting
  // sink with abort, end, or next data.
  const drain = (): void => {
    if (!cb) return

    if (abort) callback(abort)
    else if (!buffer.length && ended) callback(ended)
    else if (buffer.length) callback(null, buffer.shift())
  }

  // `callback` calls back to waiting sink,
  // and removes references to sink cb.
  const callback = (err: ValveAbort<E>, val?: P): void => {
    const _cb = cb
    // if error and pushable passed onDone, call it
    // the first time this stream ends or errors.
    if (err && onDone) {
      const c = onDone
      // tslint:disable-next-line no-parameter-reassignment
      onDone = null
      c(err === true ? null : err)
    }
    cb = null
    _cb(err, val)
  }

  return { push, end, source }
}
