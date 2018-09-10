/* tslint:disable max-func-body-length */

import {
  Stream as IStream,
  ValveError,
  ValveHandlerNextNext,
  ValveSink,
  ValveSinkFactory,
  ValveType
} from '../types'

import { Dispatcher } from './Dispatcher'
import { Source } from './Source'
import { Stream } from './Stream'
import { Through } from './Through'
import { normalizeNextNext } from './interface'

export const sinkPipeline = <T, R, E>(
  handler?: ValveHandlerNextNext<T, R, E>
): ValveSink<T, R, E> => {
  const stream = new Stream<T, R, E>()
  const normalize = normalizeNextNext(handler, stream.createObserver())

  return source => {
    const dispatcher = new Dispatcher(source, normalize)
    stream.of(dispatcher)

    return stream
  }
}

export class Sink<T, R, E extends ValveError = ValveError>
  implements ValveSinkFactory<T, R, E> {
  public type: ValveType.Sink = ValveType.Sink

  private value: ValveSink<T, R, E>

  // tslint:disable-next-line function-name
  public static create<_T, _R, _E extends ValveError = ValveError>(
    handler?: ValveHandlerNextNext<_T, _R, _E>
  ) {
    return Sink.of<_T, _R, _E>(sinkPipeline(handler))
  }

  // tslint:disable-next-line function-name
  public static of<_T, _R, _E extends ValveError = ValveError>(
    value: ValveSink<_T, _R, _E>
  ) {
    return new Sink<_T, _R, _E>(value)
  }

  constructor(value: ValveSink<T, R, E>) {
    this.value = value
  }

  public pipe() {
    return this.value
  }

  public map<_T, _R>(
    fn: (value: ValveSink<T, R, E>) => ValveSink<_T, _R, E>
  ): Sink<_T, _R, E> {
    return Sink.of(fn(this.value))
  }

  public ap(value: Source<T, E>): IStream<R, E>
  public ap<_X>(value: Through<_X, T, E>): Sink<_X, R, E>
  public ap<_X>(
    value: Through<_X, T, E> | Source<T, E>
  ): Sink<_X, R, E> | IStream<R, E> {
    switch (value.type) {
      case ValveType.Through: {
        return value.ap(this)
      }

      case ValveType.Source: {
        return this.value(value.pipe())
      }
    }
  }
}
