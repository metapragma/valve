import { unique } from './unique'

import {
  ValveThrough
} from '../types'

export function nonUnique <P, K extends keyof P, E = Error>(
  field?: K | RegExp | ((data: P) => boolean)
): ValveThrough<P, P, E> {
  return unique(field, true)
}
