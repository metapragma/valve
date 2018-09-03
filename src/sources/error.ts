import { Source } from '../internal/Source'

// a stream that errors immediately.

export function error<E>(err: E): Source<never, E> {
  return Source.create(actions => ({
    pull() {
      actions.error(err)
    }
  }))
}
