import { reduce } from './reduce'

import { ValveCreateSinkOptions, ValveError, ValveSink } from '../types'

export function concat<E = ValveError>(
  /* istanbul ignore next */
  options: Partial<ValveCreateSinkOptions<string, E>> = {}
): ValveSink<string, E> {
  return reduce<string, string, E>({
    iteratee(a, b) {
      return a + b
    },
    accumulator: '',
    ...options
  })
}
