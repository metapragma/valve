/* tslint:disable no-any */

import {
  ValveCallback,
  ValveError,
  ValveHandlerNoopNoop,
  ValveHandlerPullPull,
  ValveSource,
  ValveSourceMessage,
  ValveState,
  ValveThroughFactory,
  ValveType
} from '../types'

import {
  normalizeNoopNoop,
  normalizePullPull,
  sinkActionFactory,
  sourceActionsFactory
} from './interface'

import { sinkOperator, sourceOperator } from './operator'

const sourceMiddlewareFactory = <T, E>(
  sinkHandler?: ValveHandlerPullPull<E>
) => (cb: ValveCallback<T, E>): ValveCallback<T, E> => {
  if (sinkHandler === undefined) {
    return cb
  } else {
    return sourceOperator(normalizePullPull(sinkHandler, sinkActionFactory(cb)))
  }
}

const sinkMiddlewareFactory = <T, R, E>(
  sourceHandler?: ValveHandlerNoopNoop<T, R, E>
) => (middleware: (cb: ValveCallback<T, E>) => ValveCallback<T, E>) => (
  source: ValveSource<T, E>
) => (cb: ValveCallback<R, E, ValveSourceMessage>) => {
  if (sourceHandler !== undefined) {
    const operator = sinkOperator(
      normalizeNoopNoop(sourceHandler, sourceActionsFactory(cb))
    )

    return middleware(source(operator))
  }

  return middleware(source(cb as any))
}

// tslint:disable-next-line max-func-body-length
export const createThrough = <
  T,
  R = T,
  S = ValveState,
  E extends ValveError = ValveError
>(
  sourceHandler?: ValveHandlerNoopNoop<T, R, E>,
  sinkHandler?: ValveHandlerPullPull<E>
): ValveThroughFactory<T, R, S, E> => {
  const sourceMiddleware = sourceMiddlewareFactory<T, E>(sinkHandler)
  const sinkMiddleware = sinkMiddlewareFactory<T, R, E>(sourceHandler)

  return {
    pipe() {
      if (sourceHandler === undefined && sinkHandler === undefined) {
        return source => source as ValveSource<R, E>
      }

      return sinkMiddleware(sourceMiddleware)
    },
    type: ValveType.Through
  }
}
