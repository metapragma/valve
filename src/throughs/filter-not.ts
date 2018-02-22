import { filter } from './filter'

import { ValveThrough } from '../types'

export function filterNot<P, E = Error>(
  test: ((data: P) => boolean)
): ValveThrough<P, P, E> {
  return filter(data => {
    return !test(data)
  })
}
