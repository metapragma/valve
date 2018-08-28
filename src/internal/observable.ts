import { Observable, Observer } from '../types'

import { forEach, isUndefined, noop, pull } from 'lodash'

export const observableFactory = <T, E>() => {
  const observers: Array<Required<Observer<T, E>>> = []
  // TODO: gc on complete/error

  // TODO: invoke https://github.com/mostjs/core/blob/master/packages/core/src/invoke.js
  const observer: Required<Observer<T, E>> = {
    next(value) {
      if (observers.length === 1) {
        return observers[0].next(value)
      } else {
        forEach(observers, ({ next }) => {
          next(value)
        })
      }
    },
    complete() {
      if (observers.length === 1) {
        return observers[0].complete()
      } else {
        forEach(observers, ({ complete }) => {
          complete()
        })
      }
    },
    error(value) {
      if (observers.length === 1) {
        return observers[0].error(value)
      } else {
        forEach(observers, ({ error }) => {
          error(value)
        })
      }
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

      // TODO: stop stream on last unsubscribe
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
