import { prop } from '../util/prop'
import { filter } from './filter'

import {
  ValveThrough,
  ValveType
} from '../types'

import {
  identity
} from 'lodash'

// drop items you have already seen

export function unique <P, K extends keyof P, E = Error>(
  field?: K | RegExp | ((data: P) => boolean), invert?: boolean
): ValveThrough<P, P, E> {
  const test = prop(field) || identity

  const seen: { [key: string]: boolean } = {}

  return filter((data: P) => {
    const key = test(data)

    if (seen[key]) {
      return !!invert // false, by default
    } else {
      seen[key] = true
    }

    return !invert // true by default
  })
}
