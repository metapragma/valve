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
  pullPullFactory
} from './actionFactory'

import { createSource, sourceActionFactory } from './createSource'

// tslint:disable-next-line max-func-body-length
export const createThrough = <
  T,
  R = T,
  S = ValveState,
  E extends ValveError = ValveError
>(
  sourceHandler?: (
    actions: ValveNoopAction<R, E>
  ) => Partial<ValveNoopAction<T, E>>,
  sinkHandler?: (actions: ValvePullAction<E>) => Partial<ValvePullAction<E>>
): ValveThroughFactory<T, R, S, E> => {
  const sourceMiddleware = (
    cb: ValveCallback<T, E>
  ): ((message: ValveSinkMessage, value: T | E | undefined) => void) => {
    if (sinkHandler === undefined) {
      return (message, value) => {
        cb(message, value as any)
      }
    } else {
      const sinkActions: ValvePullAction<E> = {
        complete() {
          cb(ValveMessageType.Complete, undefined)
        },
        error(errorValue: E) {
          cb(ValveMessageType.Error, errorValue)
        },
        pull() {
          cb(ValveMessageType.Pull, undefined)
        }
      }

      const { pull, complete, error } = defaults(
        {},
        sinkHandler(sinkActions),
        pullPullFactory(sinkActions)
      )

      return (message, value) => {
        switch (message) {
          case ValveMessageType.Pull: {
            pull()
            break
          }
          case ValveMessageType.Complete: {
            complete()
            break
          }
          case ValveMessageType.Error: {
            error(value as E)
          }
        }
      }
    }
  }

  const sinkMiddleware = (middleware: typeof sourceMiddleware) => (
    source: ValveSource<T, E>
  ) => (cb: ValveCallback<R, E, ValveSourceMessage>) => {
    if (sourceHandler !== undefined) {
      const sourceActions: ValveNoopAction<R, E> = sourceActionFactory(cb)

      const { next, noop, complete, error } = defaults(
        {},
        sourceHandler(sourceActions),
        nextNextFactory(sourceActions)
      )

      return middleware(
        source((message, value) => {
          switch (message) {
            case ValveMessageType.Next: {
              // tslint:disable-next-line no-unsafe-any
              next(value as any)

              break
            }
            case ValveMessageType.Noop: {
              noop()

              break
            }
            case ValveMessageType.Complete: {
              complete()
              break
            }
            case ValveMessageType.Error: {
              error(value as E)
            }
          }
        })
      )
    }

    return middleware(
      source((message, value) => {
        cb(message, value as R | E | undefined)
      })
    )
  }

  return assign<() => ValveThrough<T, R, E>, { type: ValveType.Through }>(
    // tslint:disable-next-line max-func-body-length
    () => source => {
      if (sourceHandler === undefined && sinkHandler === undefined) {
        return source as ValveSource<R, E>
      }

      return sinkMiddleware(sourceMiddleware)(source)
    },
    { type: ValveType.Through }
  )
}
