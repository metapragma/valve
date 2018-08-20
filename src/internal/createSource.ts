import {
  ValveCallback,
  ValveCreateSourceOptions,
  ValveError,
  ValveMessageType,
  ValveSource,
  ValveSourceAction,
  ValveSourceFactory,
  ValveState,
  ValveType
} from '../types'

import { assign, defaults } from 'lodash'
import { sourceActionFactory } from './actionFactory'
import { sourceDefaultOptionsFactory } from './defaultOptionsFactory'

export const createSource = <
  T,
  S = ValveState,
  E extends ValveError = ValveError
>(
  handler: (
    actions: ValveSourceAction<T, E>
  ) => Partial<ValveCreateSourceOptions<E>> = () => ({})
): ValveSourceFactory<T, S, E> =>
  assign<() => ValveSource<T, E>, { type: ValveType.Source }>(
    () => {
      let cb: ValveCallback<T, E>

      const actions: ValveSourceAction<T, E> = sourceActionFactory(() => cb)

      const opts: ValveCreateSourceOptions<E> = defaults(
        {},
        handler(actions),
        sourceDefaultOptionsFactory(actions)
      )

      return (action, _cb) => {
        cb = _cb

        switch (action.type) {
          case ValveMessageType.Pull:
            opts.pull()
            break
          case ValveMessageType.Complete:
            opts.complete()

            break
          case ValveMessageType.Error:
            opts.error(action.payload)
        }
      }
    },
    { type: ValveType.Source }
  )
