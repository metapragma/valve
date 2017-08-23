import { unique } from './unique'

import {
  StreamThrough
} from '../types'

export function nonUnique <P, K extends keyof P, E = Error>(
  field: K | RegExp | ((data: P) => boolean)
): StreamThrough<P, P, E> {
  return unique(field, true)
}
