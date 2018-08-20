/* tslint:disable max-func-body-length */

import {
  Observable,
  Observer,
  ValveActionComplete,
  ValveActionError,
  ValveCreateSinkOptions,
  ValveError,
  ValveMessageType,
  ValveSink,
  ValveSinkFactory,
  ValveSinkMessage,
  ValveSource,
  ValveState,
  ValveType
} from '../types'

import { findEnded } from './findEnded'

import {
  assign,
  defaults,
  forEach,
  isFunction,
  isUndefined,
  noop,
  pull
} from 'lodash'

import { sinkDefaultOptionsFactory } from './defaultOptionsFactory'

const dumb = (tick: () => boolean): void => {
  let loop = true

  while (loop) {
    loop = tick()
  }

  // const next = () => process.nextTick(() => {
  //   if (loop) {
  //     loop = tick()
  //
  //     next()
  //   }
  // })

  // next()
}

const observableFactory = <T, E>() => {
  const observers: Array<Required<Observer<T, E>>> = []
  // TODO: gc on complete/error

  const observer: Required<Observer<T, E>> = {
    next(value) {
      forEach(observers, ({ next }) => {
        next(value)
      })
    },
    complete() {
      forEach(observers, ({ complete }) => {
        complete()
      })
    },
    error(value) {
      forEach(observers, ({ error }) => {
        error(value)
      })
    }
  }

  const observable: Observable<T, E> = {
    // tslint:disable-next-line function-name
    [Symbol.observable]() {
      return this
    },
    subscribe(o) {
      observers.push({
        next: isUndefined(o.next) ? noop : o.next,
        error: isUndefined(o.error) ? noop : o.error,
        complete: isUndefined(o.complete) ? noop : o.complete
      })

      return {
        unsubscribe() {
          if (observers.length !== 0) {
            pull(observers, o)
          }
        }
      }
    }
  }

  return {
    observer,
    observable
  }
}

const trampolineAbstractFactory = <T, E>(source: ValveSource<T, E>) => {
  let ended: ValveSinkMessage<E> | undefined

  const actions = {
    complete() {
      ended = findEnded<T, E>(ended, { type: ValveMessageType.Complete })
    },
    error(error: E) {
      ended = findEnded<T, E>(ended, {
        type: ValveMessageType.Error,
        payload: error
      })
    }
  }

  const trampolineFactory = (options: ValveCreateSinkOptions<T, E>) => {
    const next = (): void => {
      // this function is much simpler to write if you just use recursion,
      // but by using a while loop we do not blow the stack if the stream
      // happens to be sync.

      let loop = true
      let hasResponded = false

      const tick = () => {
        hasResponded = false

        source(
          isUndefined(ended) ? { type: ValveMessageType.Pull } : ended,
          action => {
            hasResponded = true

            switch (action.type) {
              case ValveMessageType.Next: {
                options.next(action.payload)

                if (!loop) {
                  next()
                }
                break
              }
              case ValveMessageType.Noop: {
                break
              }
              case ValveMessageType.Complete: {
                loop = false

                actions.complete()

                options.complete()

                break
              }
              case ValveMessageType.Error: {
                loop = false

                actions.error(action.payload)

                options.error(action.payload)
              }
            }
          }
        )

        if (!hasResponded) {
          loop = false

          return loop
        }

        return loop
      }

      // if (!isUndefined(scheduler)) {
      dumb(tick)
      // }
    }

    return next
  }

  return {
    actions,
    trampolineFactory
  }
}

export const createSink = <
  T,
  R,
  S = ValveState,
  E extends ValveError = ValveError
>(
  handler: (
    actions: {
      complete: ValveActionComplete
      error: ValveActionError<E>
      observer: Required<Observer<R, E>>
    }
  ) => Partial<ValveCreateSinkOptions<T, E>> = () => ({})
): ValveSinkFactory<T, R, S, E> =>
  assign<() => ValveSink<T, R, E>, { type: ValveType.Sink }>(
    () => source => {
      const { observer, observable } = observableFactory<R, E>()
      const { actions, trampolineFactory } = trampolineAbstractFactory(source)

      const options: ValveCreateSinkOptions<T, E> = defaults(
        {},
        handler(assign(actions, { observer })),
        sinkDefaultOptionsFactory(observer)
      )

      const next = trampolineFactory(options)

      return assign(
        {
          schedule() {
            next()
          }
        },
        observable
      )
    },
    { type: ValveType.Sink }
  )
