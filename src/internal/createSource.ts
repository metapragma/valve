import {
  ValveCallback,
  ValveError,
  ValveMessageType,
  ValveNoopAction,
  ValvePullAction,
  ValveSinkMessage,
  ValveSource,
  ValveSourceFactory,
  ValveSourceMessage,
  ValveState,
  ValveType
} from '../types'

import { assign, defaults } from 'lodash'
import { pullCompleteFactory } from './actionFactory'

export const sourceActionFactory = <T, E>(
  cb: ValveCallback<T, E, ValveSourceMessage>
): ValveNoopAction<T, E> => ({
  complete() {
    cb(ValveMessageType.Complete)
  },
  error(errorValue: E) {
    cb(ValveMessageType.Error, errorValue)
  },
  noop() {
    cb(ValveMessageType.Noop)
  },
  next(value: T) {
    cb(ValveMessageType.Next, value)
  }
})

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
    () => cb => {
      const actions = sourceActionFactory(cb)

      const { pull, complete, error } = defaults(
        {},
        handler(actions),
        pullCompleteFactory(actions)
      )

      return (message, value) => {
        switch (message) {
          case ValveMessageType.Pull:
            pull()

            break
          case ValveMessageType.Complete:
            complete()

            break
          case ValveMessageType.Error:
            error(value as E)
        }
      }
    },
    { type: ValveType.Source }
  )
