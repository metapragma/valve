/* tslint:disable no-shadowed-variable no-unused-expression */

// a pass through stream that doesn't change the value.

import {
  ValveThrough,
  ValveAbort,
  ValveError,
  ValveType
} from '../types'

export function through <P, E = Error>(op: (data: P) => void, onEnd?: (abort: ValveError<E>) => void): ValveThrough<P, P, E> {
  let a = false

  const once = (abort: ValveAbort<E>) => {
    if (a || !onEnd) return
    a = true
    onEnd(abort === true ? null : abort)
  }

  return {
    type: ValveType.Through,
    sink(source) {
      return {
        type: ValveType.Source,
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
