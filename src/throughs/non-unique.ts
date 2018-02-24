import { unique } from './unique'

import { ValveError, ValveThrough } from '../types'

export function nonUnique<P, K, E = ValveError>(
  iteratee?: ((data: P) => K)
): ValveThrough<P, P, E> {
  return unique(iteratee, true)
}
