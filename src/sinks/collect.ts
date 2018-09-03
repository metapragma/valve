import { reduce } from './reduce'
import { Sink } from '../internal/Sink'

import { ValveError } from '../types'

export function collect<P, E extends ValveError = ValveError>(): Sink<
  P,
  P[],
  E
> {
  return reduce<P, P[], E>((arr, item) => {
    arr.push(item)

    return arr
  }, [])
}
