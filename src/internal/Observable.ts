import { Observable as Obs, Observer, Subscription } from '../types'

import { forEach, isUndefined, noop, pull } from 'lodash'

//   // TODO: gc on complete/error
//   // TODO: invoke https://github.com/mostjs/core/blob/master/packages/core/src/invoke.js

export class Observable<T, E> implements Obs<T, E> {
  private subscriptions: Array<Required<Observer<T, E>>> = []

  public createObserver = (): Required<Observer<T, E>> => {
    const subscriptions = this.subscriptions

    return {
      next(value) {
        if (subscriptions.length === 1) {
          return subscriptions[0].next(value)
        } else {
          forEach(subscriptions, ({ next }) => {
            next(value)
          })
        }
      },
      complete() {
        if (subscriptions.length === 1) {
          return subscriptions[0].complete()
        } else {
          forEach(subscriptions, ({ complete }) => {
            complete()
          })
        }
      },
      error(value) {
        if (subscriptions.length === 1) {
          return subscriptions[0].error(value)
        } else {
          forEach(subscriptions, ({ error }) => {
            error(value)
          })
        }
      }
    }
  };

  // tslint:disable-next-line function-name
  public [Symbol.observable]() {
    return this
  }

  public subscribe(o: Observer<T, E>): Subscription {
    const subscriptions = this.subscriptions

    subscriptions.push({
      next: isUndefined(o.next) ? noop : o.next,
      error: isUndefined(o.error) ? noop : o.error,
      complete: isUndefined(o.complete) ? noop : o.complete
    })

    // TODO: stop stream on last unsubscribe
    return {
      unsubscribe() {
        if (subscriptions.length !== 0) {
          pull(subscriptions, o)
        }
      }
    }
  }
}
