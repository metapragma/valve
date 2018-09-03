import { ValveError } from '../types'

import { Source } from '../internal/Source'

export function once<P, E extends ValveError = ValveError>(
  value: P
): Source<P, E> {
  let triggered: boolean = false

  return Source.create<P, E>(({ complete, next }) => ({
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
