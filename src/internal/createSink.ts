/* tslint:disable max-func-body-length */

import {
  Observable,
  Observer,
  ValveError,
  ValveGenericAction,
  ValveMessageType,
  ValveNextAction,
  ValveSink,
  ValveSinkFactory,
  ValveSinkMessage,
  ValveSource,
  ValveSourceMessage,
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

import { nextNextWithoutNoopFactory } from './actionFactory'

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

  const trampolineFactory = (options: ValveNextAction<T, E>) => {
    let loop = true
    let hasResponded = false

    const handler = (message: ValveSourceMessage<T, E>) => {
      hasResponded = true

      switch (message.type) {
        case ValveMessageType.Next: {
          options.next(message.payload)

          if (!loop) {
            // tslint:disable-next-line no-use-before-declare
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

          actions.error(message.payload)

          options.error(message.payload)
        }
      }
    }

    const tick = () => {
      hasResponded = false

      source(
        isUndefined(ended) ? { type: ValveMessageType.Pull } : ended,
        handler
      )

      if (!hasResponded) {
        loop = false

        return loop
      }

      return loop
    }

    const next = (): void => {
      // this function is much simpler to write if you just use recursion,
      // but by using a while loop we do not blow the stack if the stream
      // happens to be sync.

      loop = true
      hasResponded = false

      dumb(tick)
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
      observer: Required<Observer<R, E>>
    } & ValveGenericAction<E>
  ) => Partial<ValveNextAction<T, E>> = () => ({})
): ValveSinkFactory<T, R, S, E> =>
  assign<() => ValveSink<T, R, E>, { type: ValveType.Sink }>(
    () => source => {
      const { observer, observable } = observableFactory<R, E>()
      const { actions, trampolineFactory } = trampolineAbstractFactory(source)

      const options: ValveNextAction<T, E> = defaults(
        {},
        handler(assign(actions, { observer })),
        nextNextWithoutNoopFactory(observer)
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
