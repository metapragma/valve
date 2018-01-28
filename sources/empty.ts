import { ValveSource, ValveType } from '../types'

// a stream that ends immediately.

export function empty(): ValveSource<void> {
  return {
    type: ValveType.Source,
    source(_, cb) {
      cb(true)
    }
  }
}
