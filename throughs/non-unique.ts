import { unique } from './unique'

import {
  IStreamThrough
} from '../types'

export function nonUnique <P, K extends keyof P, E = Error>(
  field?: K | RegExp | ((data: P) => boolean)
): IStreamThrough<P, P, E> {
  return unique(field, true)
}
