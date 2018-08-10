import { filter } from './filter'

import { ValveError, ValveThroughFactory } from '../types'

export function filterNot<P, E extends ValveError = ValveError>(
  test: ((next: P) => boolean)
): ValveThroughFactory<P, P, {}, E> {
  return filter<P, E>(next => {
    return !test(next)
  })
}
