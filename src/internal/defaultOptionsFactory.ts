import {
  Observer,
  ValveCreateSinkOptions,
  ValveCreateSourceOptions,
  ValveSourceAction
} from '../types'

export const sourceDefaultOptionsFactory = <T, E>(
  actions: ValveSourceAction<T, E>
): ValveCreateSourceOptions<E> => ({
  get pull() {
    return () => actions.complete()
  },
  get complete() {
    return () => actions.complete()
  },
  get error() {
    return (error: E) => actions.error(error)
  }
})

export const sinkDefaultOptionsFactory = <T, E>(
  // TODO: these are the same
  actions: Required<Observer<T, E>> // | ValveSourceAction<T, E>
): ValveCreateSinkOptions<T, E> => ({
  get next() {
    return (value: T) => actions.next(value)
  },
  get complete() {
    return () => actions.complete()
  },
  get error() {
    return (error: E) => actions.error(error)
  }
})
