import { ValveSourceFactory } from '../types'

import { Source } from '../internal/Source'

// a stream that errors immediately.

export function error<E>(err: E): ValveSourceFactory<never, {}, E> {
  return Source.of<never, {}, E>(actions => ({
    pull() {
      actions.error(err)
    }
  }))
}
