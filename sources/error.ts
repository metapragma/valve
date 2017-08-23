import {
  StreamSource
} from '../types'

// a stream that errors immediately.

export function error <E = Error>(err: E): StreamSource<void, E> {
  return (_, cb) => {
    cb(err)
  }
}

