import { reduce } from './reduce'

import { ValveError, ValveSinkFactory } from '../types'

export function collect<
  P,
  E extends ValveError = ValveError
>(): ValveSinkFactory<P, P[], {}, E> {
  return reduce<P, P[], E>((arr, item) => {
    arr.push(item)

    return arr
  }, [])
}
