import {
  ValveActionNoop,
  ValveActionPull,
  ValveCallback,
  ValveMessageType,
  ValveSourceMessage
} from '../types'

export const sourceOperator = <T, E>(
  actions: ValveActionPull<E>
): ValveCallback<T, E> => {
  const { pull, complete, error } = actions

  return (message, value) => {
    switch (message) {
      case ValveMessageType.Pull:
        pull()

        break
      case ValveMessageType.Complete:
        complete()

        break
      case ValveMessageType.Error:
        error(value as E)
    }
  }
}

export const sinkOperator = <T, E>(
  actions: ValveActionNoop<T, E>
): ValveCallback<T, E, ValveSourceMessage> => {
  const { next, noop, complete, error } = actions

  return (message, value) => {
    switch (message) {
      case ValveMessageType.Next: {
        // tslint:disable-next-line no-unsafe-any no-any
        next(value as T)

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
  }
}
