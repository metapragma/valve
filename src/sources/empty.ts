import { ValveError, ValveSourceFactory } from '../types'

import { Source } from '../internal/Source'

// a stream that ends immediately.

export function empty<
  P,
  E extends ValveError = ValveError
>(): ValveSourceFactory<P, {}, E> {
  return Source.of<P, {}, E>()
}
