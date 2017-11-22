/* tslint:disable no-shadowed-variable */

import {
  IStreamThrough,
  StreamAbort,
  StreamCallback,
  StreamType
} from '../types'

export function asyncMap <P, R, E = Error>(map: ((data: P, cb: StreamCallback<R, E>) => void)): IStreamThrough<P, R, E> {
  let busy: boolean = false
  let aborted: StreamAbort<E>
  let abortCb: StreamCallback<R, E>


  return {
    type: StreamType.Through,
    sink (source) {
      // tslint:disable-next-line no-function-expression

      function next (abort: StreamAbort<E>, cb: StreamCallback<R, E>) {
        if (aborted) {
          return cb(aborted)
        }

        if (abort) {
          aborted = abort

          if (!busy) {
            source.source(abort, () => cb(abort))
          } else {
            source.source(abort, () => {
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
          source.source(null, (end, data) => {
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

      return {
        type: StreamType.Source,
        source: next 
      }
    }
  }
}
