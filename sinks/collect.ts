import { reduce } from './reduce'

import {
  IStreamSink,
  StreamAbort
} from '../types'

export function collect <P, E = Error>(cb: (end?: StreamAbort<E>, acc?: P[]) => void): IStreamSink<P, E> {
  return reduce<P, P[], E>(
    (arr, item) => {
      arr.push(item)

      return arr
    },
    cb,
    []
  )
}
