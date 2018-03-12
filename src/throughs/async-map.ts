import {
  ValveActionAbort,
  ValveActionError,
  ValveActionType,
  ValveSourceCallback,
  ValveSourceFunction,
  ValveThrough,
  ValveType
} from '../types'

import { hasEnded } from '../utilities'

// TODO: use helpers

export function asyncMap<P, R, E = Error>(
  iteratee: (data: P) => Promise<R>
): ValveThrough<P, R, E> {
  let busy: boolean = false
  let ended: ValveActionAbort | ValveActionError<E>
  let abortCb: ValveSourceCallback<R, E>

  return {
    type: ValveType.Through,
    sink(source) {
      const next: ValveSourceFunction<R, E> = (action, cb) => {
        if (hasEnded(ended)) {
          return cb(ended)
        }

        if (hasEnded(action)) {
          ended = action

          if (!busy) {
            source.source(action, cb as ValveSourceCallback<{}, E>)
          } else {
            source.source(action, () => {
              // if we are still busy, wait for the mapper to complete.
              if (busy) {
                abortCb = cb
              } else {
                cb(action)
              }
            })
          }
        } else {
          source.source({ type: ValveActionType.Pull }, _action => {
            if (hasEnded(_action)) {
              cb(_action)
            } else if (hasEnded(ended)) {
              cb(ended)
            } else if (_action.type === ValveActionType.Noop) {
              cb(_action)
            } else {
              busy = true

              iteratee(_action.payload)
                .then(payload => {
                  busy = false

                  if (hasEnded(ended)) {
                    cb(ended)
                    abortCb(ended)
                  } else {
                    cb({
                      type: ValveActionType.Data,
                      payload
                    })
                  }
                })
                .catch(payload => {
                  if (hasEnded(ended)) {
                    cb(ended)
                    abortCb(ended)
                  } else {
                    next(
                      { type: ValveActionType.Error, payload: payload as E },
                      cb
                    )
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
