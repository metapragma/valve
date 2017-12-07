/* tslint:disable no-shadowed-variable */

import {
  ValveAbort,
  ValveCallback,
  ValveThrough,
  ValveType
} from '../types'

export function asyncMap <P, R, E = Error>(map: ((data: P, cb: ValveCallback<R, E>) => void)): ValveThrough<P, R, E> {
  let busy: boolean = false
  let aborted: ValveAbort<E>
  let abortCb: ValveCallback<R, E>

  return {
    type: ValveType.Through,
    sink (source) {
      // tslint:disable-next-line no-function-expression

      function next (abort: ValveAbort<E>, cb: ValveCallback<R, E>) {
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
        type: ValveType.Source,
        source: next
      }
    }
  }
}
