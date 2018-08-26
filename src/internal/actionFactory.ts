import {
  Observer,
  ValveCallback,
  ValveMessageType,
  ValveNextAction,
  ValveNoopAction,
  ValvePullAction,
  ValveSinkMessage,
  ValveSource,
  ValveSourceMessage
} from '../types'

const generics = <E>(
  actions:
    | ValveNoopAction<{}, E>
    | ValvePullAction<E>
    | Required<Observer<{}, E>>
) => ({
  complete() {
    actions.complete()
  },
  error(error: E) {
    actions.error(error)
  }
})

export const pullCompleteFactory = <T, E>(
  actions: ValveNoopAction<T, E>
): ValvePullAction<E> => ({
  pull() {
    actions.complete()
  },
  ...generics(actions)
})

export const pullPullFactory = <E>(
  actions: ValvePullAction<E>
): ValvePullAction<E> => ({
  pull() {
    actions.pull()
  },
  ...generics(actions)
})

export const nextNextWithoutNoopFactory = <T, E>(
  actions: ValveNextAction<T, E>
): ValveNextAction<T, E> => ({
  next(value: T) {
    actions.next(value)
  },
  ...generics(actions)
})

export const nextNextFactory = <T, E>(
  // TODO: these are the same
  actions: ValveNoopAction<T, E> // Required<Observer<T, E>>
): ValveNoopAction<T, E> => ({
  next(value: T) {
    actions.next(value)
  },
  noop() {
    actions.noop()
  },
  ...generics(actions)
})
