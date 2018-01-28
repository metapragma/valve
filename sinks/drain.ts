/* tslint:disable no-unsafe-any */

import {
  ValveAbort,
  ValveAbortFunction,
  ValveError,
  ValveSink,
  ValveSinkFunction,
  ValveSource,
  ValveSourceFunction,
  ValveType
} from '../types'

import { assign, isBoolean, isFunction } from 'lodash'

import { once } from '../util/once'

export function drain<P, E = Error>(
  op?: (data: P) => false | void,
  done?: (end: ValveError<E>) => void
): ValveSink<P, E> {
  let read: ValveSourceFunction<P, E>
  let abort: ValveAbort<E>
  let aborted = false
  const d = once(done)

  // tslint:disable-next-line no-unnecessary-local-variable
  const sink: ValveSinkFunction<P, E> = assign<
    (source: ValveSource<P, E>) => void,
    { abort: ValveAbortFunction<P, E> }
  >(
    _read => {
      read = _read.source

      if (isFunction(sink.abort) && abort) {
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
          read(false, (end, data) => {
            cbed = true
            // tslint:disable-next-line no-conditional-assignment no-parameter-reassignment
            if ((end = end || abort)) {
              loop = false

              if (isFunction(done)) {
                d(end === true ? false : end)
              } else if (!isBoolean(end)) {
                throw end
              }
            } else if ((isFunction(op) && op(data) === false) || abort) {
              loop = false

              if (isFunction(sink.abort)) {
                sink.abort(abort)
              }
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
      abort: (err = false, cb) => {
        abort = err || true
        if (isFunction(read) && aborted === false) {
          aborted = true

          return read(abort, (end: ValveError<E>, data: P | undefined) => {
            if (isFunction(cb)) {
              cb(end, data)
            }

            return d(end)
          })
        }
      }
    }
  )

  return {
    type: ValveType.Sink,
    sink
  }
}
