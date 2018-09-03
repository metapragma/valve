import { ValveError } from '../types'

import { Source } from '../internal/Source'

export function count<E extends ValveError = ValveError>(
  max = Infinity
): Source<number, E> {
  let i = 0

  return Source.create<number, E>(({ complete, next }) => ({
    pull() {
      if (i >= max) {
        complete()
      } else {
        next((i += 1))
      }
    }
  }))
}
