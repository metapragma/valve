import { ValveError, ValveSourceFactory } from '../types'

import { Source } from '../internal/Source'

export function count<E extends ValveError = ValveError>(
  max = Infinity
): ValveSourceFactory<number, {}, E> {
  let i = 0

  return Source.of<number, {}, E>(({ complete, next }) => ({
    pull() {
      if (i >= max) {
        complete()
      } else {
        next((i += 1))
      }
    }
  }))
}
