import { reduce } from './reduce'

import { ValveCreateSinkOptions, ValveError, ValveSinkFactory } from '../types'

export function collect<P, E = ValveError>(
  /* istanbul ignore next */
  options: Partial<ValveCreateSinkOptions<P[], E>> = {}
): ValveSinkFactory<P, E> {
  return reduce<P, P[], E>({
    iteratee(arr, item) {
      arr.push(item)

      return arr
    },
    accumulator: [],
    ...options
  })
}
