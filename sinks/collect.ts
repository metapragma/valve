import { reduce } from './reduce'

import {
  ValveSink,
  ValveError
} from '../types'

export function collect <P, E = Error>(cb: (end?: ValveError<E>, acc?: P[]) => void): ValveSink<P, E> {
  return reduce<P, P[], E>(
    (arr, item) => {
      arr.push(item)

      return arr
    },
    cb,
    []
  )
}
