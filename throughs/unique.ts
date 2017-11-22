import { prop } from '../util/prop'
import { filter } from './filter'
import { id } from '../util/id'

import {
  IStreamThrough,
  StreamType
} from '../types'

// drop items you have already seen

export function unique <P, K extends keyof P, E = Error>(
  field?: K | RegExp | ((data: P) => boolean), invert?: boolean
): IStreamThrough<P, P, E> {
  const test = prop(field) || id

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
