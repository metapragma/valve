import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../utilities'
// a stream that ends immediately.

export function empty<P, E = ValveError>(): ValveSourceFactory<P, E> {
  return createSource<P, E>()
}
