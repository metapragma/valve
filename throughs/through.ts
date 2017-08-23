/* tslint:disable no-shadowed-variable no-unused-expression */

// a pass through stream that doesn't change the value.

import {
  StreamAbort,
  StreamThrough
} from '../types'

export function through <P, E = Error>(op: (data: P) => void, onEnd?: (abort: StreamAbort<E>) => void): StreamThrough<P, P, E> {
  let a = false

  const once = (abort: StreamAbort<E>) => {
    if (a || !onEnd) return
    a = true
    onEnd(abort === true ? null : abort)
  }

  return read => {
    return (end, cb) => {
      if (end) once(end)

      return read(end, (end, data) => {
        if (!end) op && op(data)
        else once(end)
        cb(end, data)
      })
    }
  }
}
