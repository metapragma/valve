import { reduce } from './reduce'

import { ValveError, ValveSinkFactory } from '../types'

export function concat<E extends ValveError = ValveError>(): ValveSinkFactory<
  string,
  string,
  {},
  E
> {
  return reduce<string, string, E>((a, b) => {
    return a + b
  }, '')
}
