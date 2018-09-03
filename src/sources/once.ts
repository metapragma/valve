import { ValveError, ValveSourceFactory } from '../types'

import { Source } from '../internal/Source'

export function once<P, E extends ValveError = ValveError>(
  value: P
): ValveSourceFactory<P, {}, E> {
  let triggered: boolean = false

  return Source.of<P, {}, E>(({ complete, next }) => ({
    pull() {
      if (triggered === false) {
        triggered = true
        next(value)
      } else {
        complete()
      }
    }
  }))
}
