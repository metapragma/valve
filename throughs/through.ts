/* tslint:disable no-shadowed-variable no-unused-expression */

// a pass through stream that doesn't change the value.

import {
  IStreamThrough,
  StreamAbort,
  StreamType
} from '../types'

export function through <P, E = Error>(op: (data: P) => void, onEnd?: (abort: StreamAbort<E>) => void): IStreamThrough<P, P, E> {
  let a = false

  const once = (abort: StreamAbort<E>) => {
    if (a || !onEnd) return
    a = true
    onEnd(abort === true ? null : abort)
  }

  return {
    type: StreamType.Through,
    sink(source) {
      return {
        type: StreamType.Source,
        source(end, cb) {
          if (end) once(end)

          return source.source(end, (end, data) => {
            if (!end) op && op(data)
            else once(end)
            cb(end, data)
          })
        }
      }
    }
  }
}
