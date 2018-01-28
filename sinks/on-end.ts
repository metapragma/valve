import { drain } from './drain'

import { ValveError, ValveSink } from '../types'

export function onEnd<P, E = Error>(
  done: (end: ValveError<E>) => void
): ValveSink<P, E> {
  return drain(undefined, done)
}
