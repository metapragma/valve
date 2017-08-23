import { drain } from './drain'

import {
  StreamAbort,
  StreamSink
} from '../types'

export function onEnd <P, E = Error>(done: (end: StreamAbort<E>) => void): StreamSink<P, E> {
  return drain(null, done)
}
