import { ValveError } from '../types'

import { Source } from '../internal/Source'

// a stream that ends immediately.

export function empty<P, E extends ValveError = ValveError>(): Source<P, E> {
  return Source.create<P, E>()
}
