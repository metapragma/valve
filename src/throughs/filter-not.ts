import { filter } from './filter'

import { ValveError, ValveThrough } from '../types'

export function filterNot<P, E = ValveError>(
  test: ((data: P) => boolean)
): ValveThrough<P, P, E> {
  return filter<P, E>(data => {
    return !test(data)
  })
}
