import { reduce } from './reduce'

import { ValveError } from '../types'

import { Sink } from '../internal/Sink'

export function concat<E extends ValveError = ValveError>(): Sink<
  string,
  string,
  E
> {
  return reduce((a, b) => {
    return a + b
  }, '')
}
