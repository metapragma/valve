import { filter } from './filter'

import {
  ValveThrough,
  ValveType
} from '../types'

import {
  identity,
  includes
} from 'lodash'

// drop items you have already seen

export function unique <P, K, E = Error>(
  iteratee?: ((data: P) => K), invert?: boolean
): ValveThrough<P, P, E> {
  const test = (typeof iteratee === 'undefined')
    ? identity
    : iteratee

  const seen: K[] = []

  return filter((data: P) => {
    const key = test(data)

    if (includes(seen, key)) {
      return !!invert // false, by default
    } else {
      seen.push(key)
    }

    return !invert // true by default
  })
}
