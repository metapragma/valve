import { filter } from './filter'

import { ValveError } from '../types'

import { Through } from '../internal/Through'

export function filterNot<P, E extends ValveError = ValveError>(
  test: ((next: P) => boolean)
): Through<P, P, E> {
  return filter<P, E>(next => {
    return !test(next)
  })
}
