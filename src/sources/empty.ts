import { ValveError, ValveSource } from '../types'

import { createSource } from '../utilities'
// a stream that ends immediately.

export function empty<P, E = ValveError>(): ValveSource<P, E> {
  return createSource<P, E>()
}
