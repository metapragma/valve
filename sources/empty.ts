import {
  IStreamSource,
  StreamType
} from '../types'

// a stream that ends immediately.

export function empty (): IStreamSource<void> {
  return {
    type: StreamType.Source,
    source (_, cb) {
      cb(true)
    }
  }
}