import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../utilities'

export function count<E extends ValveError = ValveError>(
  max = Infinity
): ValveSourceFactory<number, {}, E> {
  let i = 0

  return createSource<number, {}, E>(({ abort, data }) => ({
    onPull() {
      if (i >= max) {
        abort()
      } else {
        data((i += 1))
      }
    }
  }))
}
