import { drain } from './drain'

import {
  ValveSink,
  ValveError,
} from '../types'

export function onEnd <P, E = Error>(done: (end: ValveError<E>) => void): ValveSink<P, E> {
  return drain(null, done)
}
