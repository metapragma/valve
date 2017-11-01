import {
  StreamSinkAbort,
  StreamAbort,
  StreamSink,
  StreamSource
} from '../types'

import {
  assign,
  noop
} from 'lodash'

export function drain <P, E = Error>(op?: (data: P) => false | void, done?: (end: StreamAbort<E>) => void): StreamSink<P, E> {
  let read: StreamSource<P, E>
  let abort: StreamAbort<E>

  // tslint:disable-next-line no-unnecessary-local-variable
  const sink: StreamSink<P, E> = assign<
    (source: StreamSource<P, E>) => void,
    { abort: StreamSinkAbort<P, E> }
  >(
    _read => {
      read = _read

      if (abort) {
        return sink.abort()
      }

      // this function is much simpler to write if you
      // just use recursion, but by using a while loop
      // we do not blow the stack if the stream happens to be sync.

      // tslint:disable-next-line no-function-expression
      (function next() {
        let loop = true
        let cbed = false

        while (loop) {
          cbed = false
          read(null, (end, data) => {
            cbed = true
            // tslint:disable-next-line no-conditional-assignment
            if ((end = end || abort)) {
              loop = false
              if (done) done(end === true ? null : end)
              else if (end && end !== true) throw end
            } else if ((op && false === op(data)) || abort) {
              loop = false
              read(abort || true, done || noop)
            } else if (!loop) {
              next()
            }
          })
          if (!cbed) {
            loop = false

            return
          }
        }
      })()
    },
    {
      abort: (err, cb) => {
        abort = err || true
        if (read) return read(abort, cb || noop)
      }
    }
  )

  return sink
}
