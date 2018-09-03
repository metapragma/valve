import { unique } from './unique'

import { ValveError } from '../types'

import { Through } from '../internal/Through'

export function nonUnique<P, K, E extends ValveError = ValveError>(
  iteratee?: ((next: P) => K)
): Through<P, P, E> {
  return unique(iteratee, true)
}
