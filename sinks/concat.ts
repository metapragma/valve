import { reduce } from './reduce'

import {
  IStreamSink,
  StreamAbort
} from '../types'

export function concat <E = Error>(cb: (end?: StreamAbort<E>, acc?: string) => void): IStreamSink<string, E> {
  return reduce<string, string, E>(
    (a, b) => {
      return a + b
    },
    cb,
    ''
  )
}
