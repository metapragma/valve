import { reduce } from './reduce'

import {
  StreamAbort,
  StreamSink
} from '../types'

export function collect <P, E = Error>(cb: (end?: StreamAbort<E>, acc?: P[]) => void): StreamSink<P, E> {
  return reduce<P, P[], E>(
    (arr, item) => {
      arr.push(item)

      return arr
    },
    cb,
    []
  )
}
