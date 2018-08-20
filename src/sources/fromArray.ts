import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../internal/createSource'

export function fromArray<P, E extends ValveError = ValveError>(
  array: ArrayLike<P>
): ValveSourceFactory<P, {}, E> {
  let i = 0

  return createSource<P, {}, E>(({ complete, next }) => ({
    pull() {
      if (i >= array.length) {
        complete()
      } else {
        // tslint:disable-next-line no-increment-decrement
        next(array[i++])
      }
    }
  }))
}
