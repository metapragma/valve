import { unique } from './unique'

import { ValveThrough } from '../types'

export function nonUnique<P, K, E = Error>(
  iteratee?: ((data: P) => K)
): ValveThrough<P, P, E> {
  return unique(iteratee, true)
}
