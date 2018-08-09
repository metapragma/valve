import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../utilities'

export function once<P, E = ValveError>(value: P): ValveSourceFactory<P, {}, E> {
  let triggered: boolean = false

  return createSource<P, {}, E>(({ abort, data }) => ({
    onPull() {
      if (triggered === false) {
        triggered = true
        data(value)
      } else {
        abort()
      }
    }
  }))
}
