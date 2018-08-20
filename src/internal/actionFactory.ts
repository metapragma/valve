import { ValveCallback, ValveMessageType, ValveSourceAction } from '../types'

export const sourceActionFactory = <T, E>(
  cb: () => ValveCallback<T, E>
): ValveSourceAction<T, E> => {
  return {
    get complete() {
      return () => cb()({ type: ValveMessageType.Complete })
    },
    get error() {
      return (error: E) =>
        cb()({ type: ValveMessageType.Error, payload: error })
    },
    get noop() {
      return () => cb()({ type: ValveMessageType.Noop })
    },
    get next() {
      return (next: T) => cb()({ type: ValveMessageType.Next, payload: next })
    }
  }
}
