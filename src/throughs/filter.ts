import { ValveError } from '../types'

import { Through } from '../internal/Through'

export function filter<P, E extends ValveError = ValveError>(
  predicate: ((next: P) => boolean)
): Through<P, P, E> {
  return Through.create<P, P, E>(({ next, noop }) => ({
    next(payload) {
      if (predicate(payload)) {
        next(payload)
      } else {
        noop()
      }
    }
  }))
}
