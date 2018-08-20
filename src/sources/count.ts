import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../index'

export function count<E extends ValveError = ValveError>(
  max = Infinity
): ValveSourceFactory<number, {}, E> {
  let i = 0

  return createSource<number, {}, E>(({ complete, next }) => ({
    pull() {
      if (i >= max) {
        complete()
      } else {
        next((i += 1))
      }
    }
  }))
}
