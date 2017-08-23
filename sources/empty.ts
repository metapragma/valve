import {
  StreamSource
} from '../types'

// a stream that ends immediately.

export function empty (): StreamSource<void> {
  return (_, cb) => {
    cb(true)
  }
}
