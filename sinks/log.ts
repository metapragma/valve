import { drain } from './drain'

import {
  IStreamSink,
  StreamAbort
} from '../types'

export function log <P, E = Error>(done: (end: StreamAbort<E>) => void): IStreamSink<P, E> {
  return drain(data => {
    // tslint:disable-next-line no-console
    console.log(data)
  }, done)
}
