import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../index'
// a stream that ends immediately.

export function empty<
  P,
  E extends ValveError = ValveError
>(): ValveSourceFactory<P, {}, E> {
  return createSource<P, {}, E>()
}
