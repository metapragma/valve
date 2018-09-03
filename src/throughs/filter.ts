import { ValveError, ValveThroughFactory } from '../types'

import { Through } from '../internal/Through'

export function filter<P, E extends ValveError = ValveError>(
  predicate: ((next: P) => boolean)
): ValveThroughFactory<P, P, {}, E> {
  return Through.of<P, P, {}, E>(({ next, noop }) => ({
    next(payload) {
      if (predicate(payload)) {
        next(payload)
      } else {
        noop()
      }
    }
  }))
}
