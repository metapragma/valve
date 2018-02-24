import { filter } from './filter'
import { ValveError, ValveThrough } from '../types'
import { identity, includes } from 'lodash'

// drop items you have already seen

export function unique<P, K, E = ValveError>(
  test: ((data: P) => K) = identity,
  invert: boolean = false
): ValveThrough<P, P, E> {
  const seen: K[] = []

  return filter((data: P) => {
    const key = test(data)

    if (includes(seen, key)) {
      return !!Boolean(invert) // false, by default
    } else {
      seen.push(key)
    }

    return !Boolean(invert) // true by default
  })
}
