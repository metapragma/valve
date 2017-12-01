import {
  IStreamSource,
  StreamType
} from '../types'

// a stream that errors immediately.

export function error <E = Error>(err: E): IStreamSource<void, E> {
  return {
    type: StreamType.Source,
    source (_, cb) {
      cb(err)
    }
  }
}
