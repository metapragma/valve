import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../utilities'

// a stream that errors immediately.

export function error<P, E = ValveError>(err: E): ValveSourceFactory<P, E> {
  return createSource<P, E>(actions => ({
    onPull() {
      actions.error(err)
    }
  }))
}
