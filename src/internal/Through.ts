/* tslint:disable no-circular-imports */

import {
  ValveCallback,
  ValveError,
  ValveHandlerNoopNoop,
  ValveHandlerPullPull,
  ValveSource,
  ValveSourceMessage,
  ValveThrough,
  ValveThroughFactory,
  ValveType
} from '../types'

import {
  normalizeNoopNoop,
  normalizePullPull,
  sinkActionFactory,
  sourceActionsFactory
} from './interface'

import { Source } from './Source'
import { Sink } from './Sink'

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

  return middleware(source(cb as ValveCallback<T, E, ValveSourceMessage>))
}

export class Through<T, R = T, E extends ValveError = ValveError>
  implements ValveThroughFactory<T, R, E> {
  public type: ValveType.Through = ValveType.Through

  private value: ValveThrough<T, R, E>

  // tslint:disable-next-line function-name
  public static create<_T, _R = _T, _E extends ValveError = ValveError>(
    sourceHandler?: ValveHandlerNoopNoop<_T, _R, _E>,
    sinkHandler?: ValveHandlerPullPull<_E>
  ) {
    if (sourceHandler === undefined && sinkHandler === undefined) {
      return new Through<_T, _R, _E>(source => source as ValveSource<_R, _E>)
    } else {
      const sourceMiddleware = sourceMiddlewareFactory<_T, _E>(sinkHandler)
      const sinkMiddleware = sinkMiddlewareFactory<_T, _R, _E>(sourceHandler)

      return Through.of<_T, _R, _E>(sinkMiddleware(sourceMiddleware))
    }
  }

  // tslint:disable-next-line function-name
  public static of<_T, _R = _T, _E extends ValveError = ValveError>(
    value: ValveThrough<_T, _R, _E>
  ) {
    return new Through<_T, _R, _E>(value)
  }

  constructor(value: ValveThrough<T, R, E>) {
    this.value = value
  }

  public pipe() {
    return this.value
  }

  public map<_T, _R>(
    fn: (value: ValveThrough<T, R, E>) => ValveThrough<_T, _R, E>
  ): Through<_T, _R, E> {
    return Through.of(fn(this.value))
  }

  public concat<_R>(value: Through<R, _R, E>): Through<T, _R, E> {
    return value.map<T, _R>(x => cb => x(this.value(cb)))
  }

  // public concatLeft<_T>(value: Through<_T, T, E>): Through<_T, R, E> {
  //   return value.map<_T, R>(x => cb => this.value(x(cb)))
  // }

  public ap(value: Source<T, E>): Source<R, E>
  // public ap<_X>(value: Through<_X, T, E>): Through<_X, R, E>
  public ap<_X>(value: Sink<R, _X, E>): Sink<T, _X, E>
  public ap<_X>(
    value: /* Through<_X, T, E> | */ Source<T, E> | Sink<R, _X, E>
  ): /* Through<_X, R, E> | */ Source<R, E> | Sink<T, _X, E> {
    switch (value.type) {
      case ValveType.Source: {
        return value.map(this.value)
      }

      // case ValveType.Through: {
      //   return this.concatLeft(value)
      // }

      case ValveType.Sink: {
        return value.map<T, _X>(sink => cb => sink(this.value(cb)))
      }
    }
  }
}
