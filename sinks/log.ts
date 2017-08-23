import { drain } from './drain'

import {
  StreamAbort,
  StreamSink
} from '../types'

export function log <P, E = Error>(done: (end: StreamAbort<E>) => void): StreamSink<P, E> {
  return drain(data => {
    // tslint:disable-next-line no-console
    console.log(data)
  }, done)
}
