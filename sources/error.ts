import {
  ValveSource,
  ValveType
} from '../types'

// a stream that errors immediately.

export function error <E = Error>(err: E): ValveSource<void, E> {
  return {
    type: ValveType.Source,
    source (_, cb) {
      cb(err)
    }
  }
}
