import { drain } from './drain'

import {
  IStreamSink,
  StreamAbort,
} from '../types'

export function onEnd <P, E = Error>(done: (end: StreamAbort<E>) => void): IStreamSink<P, E> {
  return drain(null, done)
}
