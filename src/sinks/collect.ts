import { reduce } from './reduce'

import { ValveCreateSinkOptions, ValveError, ValveSink } from '../types'

export function collect<P, E = ValveError>(
  options: Partial<ValveCreateSinkOptions<P[], E>> = {}
): ValveSink<P, E> {
  return reduce<P, P[], E>({
    iteratee(arr, item) {
      arr.push(item)

      return arr
    },
    accumulator: [],
    ...options
  })
}
