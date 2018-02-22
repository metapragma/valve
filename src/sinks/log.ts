import { drain } from './drain'

import { ValveError, ValveSink } from '../types'

export function log<P, E = Error>(
  done: (end: ValveError<E>) => void
): ValveSink<P, E> {
  return drain(data => {
    // tslint:disable-next-line no-console
    console.log(data)
  }, done)
}
