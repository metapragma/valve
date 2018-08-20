import { ValveSourceFactory } from '../types'

import { createSource } from '../index'

// a stream that errors immediately.

export function error<E>(err: E): ValveSourceFactory<never, {}, E> {
  return createSource<never, {}, E>(actions => ({
    pull() {
      actions.error(err)
    }
  }))
}
