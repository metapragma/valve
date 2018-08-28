/* tslint:disable completed-docs */

import {
  Observer,
  ValveActionGeneric,
  ValveActionNext,
  ValveActionNoop,
  ValveActionPull,
  ValveCallback,
  ValveHandlerNextNext,
  ValveHandlerNoopNoop,
  ValveHandlerNoopPull,
  ValveHandlerPullPull,
  ValveMessageType,
  ValveSourceMessage
} from '../types'

import { defaults } from 'lodash'

abstract class DefaultActionGeneric<A extends ValveActionGeneric<E>, E>
  implements ValveActionGeneric<E> {
  public _actions: A

  constructor(actions: A) {
    this._actions = actions
  }

  public complete = () => {
    this._actions.complete()
  }

  public error = (errorValue: E) => {
    this._actions.error(errorValue)
  }
}

class DefaultNoopPull<T, E>
  extends DefaultActionGeneric<ValveActionNoop<T, E>, E>
  implements ValveActionPull<E> {
  public pull = () => {
    this._actions.complete()
  }
}

class DefaultNextNext<T, E>
  extends DefaultActionGeneric<ValveActionNext<T, E>, E>
  implements ValveActionNext<T, E> {
  public next = (value: T) => {
    this._actions.next(value)
  }
}

class DefaultPullPull<E> extends DefaultActionGeneric<ValveActionPull<E>, E>
  implements ValveActionPull<E> {
  public pull = () => {
    this._actions.pull()
  }
}

class DefaultNoopNoop<T, E>
  extends DefaultActionGeneric<ValveActionNoop<T, E>, E>
  implements ValveActionNoop<T, E> {
  public next = (value: T) => {
    this._actions.next(value)
  }

  public noop = () => {
    this._actions.noop()
  }
}

// noop-pull
export const normalizeNoopPull = <T, E>(
  handler: ValveHandlerNoopPull<T, E>,
  actions: ValveActionNoop<T, E>
): ValveActionPull<E> =>
  defaults(handler(actions), new DefaultNoopPull(actions))

// pull-pull
export const normalizePullPull = <E>(
  handler: ValveHandlerPullPull<E>,
  actions: ValveActionPull<E>
): ValveActionPull<E> =>
  defaults(handler(actions), new DefaultPullPull(actions))

// noop-noop
export const normalizeNoopNoop = <T, R, E>(
  handler: ValveHandlerNoopNoop<T, R, E>,
  actions: ValveActionNoop<R, E>
): ValveActionNoop<T, E> =>
  defaults(handler(actions), new DefaultNoopNoop(actions))

// next-next
export const normalizeNextNext = <T, R, E>(
  handler: ValveHandlerNextNext<T, R, E>,
  observer: Required<Observer<R, E>>
) => (actions: ValveActionGeneric<E>): ValveActionNext<T, E> =>
  defaults(handler(observer, actions), new DefaultNextNext(observer))

export const sourceActionsFactory = <T, E>(
  cb: ValveCallback<T, E, ValveSourceMessage>
): ValveActionNoop<T, E> => ({
  complete() {
    cb(ValveMessageType.Complete)
  },
  error(errorValue: E) {
    cb(ValveMessageType.Error, errorValue)
  },
  noop() {
    cb(ValveMessageType.Noop)
  },
  next(value: T) {
    cb(ValveMessageType.Next, value)
  }
})

export const sinkActionFactory = <T, E>(
  cb: ValveCallback<T, E>
): ValveActionPull<E> => ({
  complete() {
    cb(ValveMessageType.Complete, undefined)
  },
  error(errorValue: E) {
    cb(ValveMessageType.Error, errorValue)
  },
  pull() {
    cb(ValveMessageType.Pull, undefined)
  }
})
