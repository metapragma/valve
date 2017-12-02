import { reduce } from './reduce'

import {
  ValveSink,
  ValveError
} from '../types'

export function concat <E = Error>(cb: (end?: ValveError<E>, acc?: string) => void): ValveSink<string, E> {
  return reduce<string, string, E>(
    (a, b) => {
      return a + b
    },
    cb,
    ''
  )
}
