/* tslint:disable no-any */

import {
  ValveCallback,
  ValveError,
  ValveMessageType,
  ValveNextAction,
  ValveNoopAction,
  ValvePullAction,
  ValveSinkMessage,
  ValveSource,
  ValveSourceMessage,
  ValveState,
  ValveThrough,
  ValveThroughFactory,
  ValveType
} from '../types'

import { assign, defaults } from 'lodash'

import {
  nextNextFactory,
  pullCompleteFactory,
  pullPullFactory,
  sinkActionFactory
} from './actionFactory'

import { createSource } from './createSource'

const through = <T, R = T, E extends ValveError = ValveError>(
  source: ValveSource<T, E>,
  sourceHandler: (
    actions: ValveNoopAction<R, E>
  ) => Partial<ValveNoopAction<T, E>> = () => ({}),
  sinkHandler: (
    actions: ValvePullAction<E>
  ) => Partial<ValvePullAction<E>> = () => ({})
) =>
  createSource<R, {}, E>(actions => {
    const sourceActions: ValveNoopAction<R, E> = defaults(
      {},
      sourceHandler(actions),
      nextNextFactory(actions)
    )

    const sinkCb: (action: ValveSourceMessage<any, E>) => void = action => {
      switch (action.type) {
        case ValveMessageType.Next: {
          // tslint:disable-next-line no-unsafe-any
          sourceActions.next(action.payload)

          break
        }
        case ValveMessageType.Noop: {
          sourceActions.noop()

          break
        }
        case ValveMessageType.Complete: {
          sourceActions.complete()
          break
        }
        case ValveMessageType.Error: {
          sourceActions.error(action.payload)
        }
      }
    }

    const sinkActions: ValvePullAction<E> = sinkActionFactory(source, sinkCb)

    return defaults({}, sinkHandler(sinkActions), pullPullFactory(sinkActions))
  })

// tslint:disable-next-line max-func-body-length
export const createThrough = <
  T,
  R = T,
  S = ValveState,
  E extends ValveError = ValveError
>(
  sourceHandler: (
    actions: ValveNoopAction<R, E>
  ) => Partial<ValveNoopAction<T, E>> = () => ({}),
  sinkHandler: (
    actions: ValvePullAction<E>
  ) => Partial<ValvePullAction<E>> = () => ({})
): ValveThroughFactory<T, R, S, E> => {
  return assign<() => ValveThrough<T, R, E>, { type: ValveType.Through }>(
    // tslint:disable-next-line max-func-body-length
    () => source => {
      return through<T, R, E>(source, sourceHandler, sinkHandler)()
    },
    { type: ValveType.Through }
  )
}
