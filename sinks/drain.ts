import {
  IStreamSink,
  IStreamSource,
  StreamAbort,
  StreamSink,
  StreamSinkAbort,
  StreamSource,
  StreamType
} from '../types'

import {
  assign,
  noop,
} from 'lodash'

import {
  once
} from '../util/once'

export function drain <P, E = Error>(op?: (data: P) => false | void, done?: (end: StreamAbort<E>) => void): IStreamSink<P, E> {
  let read: StreamSource<P, E>
  let abort: StreamAbort<E>
  let aborted = false
  const d = once(done)

  // tslint:disable-next-line no-unnecessary-local-variable
  const sink: StreamSink<P, E> = assign<
    (source: IStreamSource<P, E>) => void,
    { abort: StreamSinkAbort<P, E> }
  >(
    _read => {
      read = _read.source

      if (abort) {
        return sink.abort(abort)
      }

      // this function is much simpler to write if you
      // just use recursion, but by using a while loop
      // we do not blow the stack if the stream happens to be sync.

      // tslint:disable-next-line no-function-expression
      ;(function next() {
        let loop = true
        let cbed = false

        while (loop) {
          cbed = false
          read(null, (end, data) => {
            cbed = true
            // tslint:disable-next-line no-conditional-assignment no-parameter-reassignment
            if ((end = end || abort)) {
              loop = false
              if (done) d(end === true ? null : end)
              else if (end && end !== true) throw end
            } else if ((op && false === op(data)) || abort) {
              loop = false

              sink.abort(abort)
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
        if (read && aborted === false) {
          aborted = true

          return read(abort, (end, data) => {
            if (cb) {
              cb(end, data)
            }

            return d(end)
          })
        }
      }
    }
  )

  return {
    type: StreamType.Sink,
    sink
  }
}
