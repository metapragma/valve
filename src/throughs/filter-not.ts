import { filter } from './filter'

import { ValveError, ValveThroughFactory } from '../types'

export function filterNot<P, E = ValveError>(
  test: ((data: P) => boolean)
): ValveThroughFactory<P, P, E> {
  return filter<P, E>(data => {
    return !test(data)
  })
}
