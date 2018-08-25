import {
  ValveCallback,
  ValveError,
  ValveMessageType,
  ValveNoopAction,
  ValvePullAction,
  ValveSinkMessage,
  ValveSource,
  ValveSourceFactory,
  ValveState,
  ValveType
} from '../types'

import { assign, defaults } from 'lodash'
import { pullCompleteFactory } from './actionFactory'

export const createSource = <
  T,
  S = ValveState,
  E extends ValveError = ValveError
>(
  handler: (
    actions: ValveNoopAction<T, E>
  ) => Partial<ValvePullAction<E>> = () => ({})
): ValveSourceFactory<T, S, E> =>
  assign<() => ValveSource<T, E>, { type: ValveType.Source }>(
    () => {
      let cb: ValveCallback<T, E>

      const actions: ValveNoopAction<T, E> = {
        complete() {
          cb({ type: ValveMessageType.Complete })
        },
        error(errorValue: E) {
          cb({ type: ValveMessageType.Error, payload: errorValue })
        },
        noop() {
          cb({ type: ValveMessageType.Noop })
        },
        next(value: T) {
          cb({ type: ValveMessageType.Next, payload: value })
        }
      }

      const { pull, complete, error } = defaults(
        {},
        handler(actions),
        pullCompleteFactory(actions)
      )

      return (message, _cb) => {
        cb = _cb

        switch (message.type) {
          case ValveMessageType.Pull:
            pull()

            break
          case ValveMessageType.Complete:
            complete()

            break
          case ValveMessageType.Error:
            error(message.payload)
        }
      }
    },
    { type: ValveType.Source }
  )
