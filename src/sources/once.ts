import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../utilities'

export function once<P, E extends ValveError = ValveError>(
  value: P
): ValveSourceFactory<P, {}, E> {
  let triggered: boolean = false

  return createSource<P, {}, E>(({ complete, next }) => ({
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
