/* tslint:disable no-shadowed-variable */

import {
  StreamAbort,
  StreamCallback,
  StreamThrough,
} from '../types'

export function asyncMap <P, R, E = Error>(map: ((data: P, cb: StreamCallback<R, E>) => void)): StreamThrough<P, R, E> {
  let busy: boolean = false
  let aborted: StreamAbort<E>
  let abortCb: StreamCallback<R, E>

  return read => {
    // tslint:disable-next-line no-function-expression
    return function next(abort, cb) {
      if (aborted) {
        return cb(aborted)
      }

      if (abort) {
        aborted = abort

        if (!busy) {
          read(abort, () => cb(abort))
        } else {
          read(abort, () => {
            // if we are still busy, wait for the mapper to complete.
            if (busy) {
              abortCb = cb
            }
            else {
              cb(abort)
            }
          })
        }
      } else {
        read(null, (end, data) => {
          if (end) {
            cb(end)
          } else if (aborted) {
            cb(aborted)
          } else {
            busy = true

            map(data, (err, result) => {
              busy = false

              if (aborted) {
                cb(aborted)
                abortCb(aborted)
              } else if (err) {
                next(err, cb)
              } else {
                cb(null, result)
              }
            })
          }
        })
      }
    }
  }
}
