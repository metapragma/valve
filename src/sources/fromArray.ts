import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../internal/createSource'

export const fromArray = <P, E extends ValveError = ValveError>(
  array: Array<P>
): ValveSourceFactory<P, {}, E> =>
  createSource<P, {}, E>(({ complete, next }) => {
    let i = 0
    const length = array.length

    return {
      pull() {
        if (i >= length) {
          complete()
        } else {
          next(array[i])

          i += 1
        }
      }
    }
  })
