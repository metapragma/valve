import { reduce } from './reduce'

import {
  StreamAbort,
  StreamSink
} from '../types'

export function concat <E = Error>(cb: (end?: StreamAbort<E>, acc?: string) => void): StreamSink<string, E> {
  return reduce<string, string, E>(
    (a, b) => {
      return a + b
    },
    cb,
    ''
  )
}
