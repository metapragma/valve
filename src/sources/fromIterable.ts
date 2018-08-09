import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../utilities'
import { createIterator } from '../iterall'

function next<P, E>(
  iterator: Iterator<P>
):
  | { failed: true; payload: E }
  | { failed: false; payload: IteratorResult<P> } {
  try {
    const result = iterator.next()

    return {
      failed: false,
      payload: result
    }
  } catch (err) {
    return {
      failed: true,
      payload: err as E
    }
  }
}

export function fromIterable<P, E extends ValveError = ValveError>(
  iterable: Iterable<P> | ArrayLike<P>,
  safe: boolean = true
): ValveSourceFactory<P, {}, E> {
  const iterator = createIterator(iterable)

  if (safe === true) {
    return createSource<P, {}, E>(({ abort, data }) => ({
      onPull() {
        const { value, done } = iterator.next()

        if (done) {
          abort()
        } else {
          data(value)
        }
      }
    }))
  } else {
    return createSource<P, {}, E>(({ abort, data, error }) => ({
      onPull() {
        const result = next<P, E>(iterator)

        if (result.failed === true) {
          error(result.payload)
        } else {
          if (result.payload.done) {
            abort()
          } else {
            data(result.payload.value)
          }
        }
      }
    }))
  }
}
