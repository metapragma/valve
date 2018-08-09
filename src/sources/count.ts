import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../utilities'

export function count<E = ValveError>(max = Infinity) {
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
