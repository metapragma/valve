import { values } from './values'

import {
  keys as _keys
} from 'lodash'

import {
  ValveSource
} from '../types'

export function keys <P, K extends keyof P, E = Error>(obj: P): ValveSource<K, E> {
  return values<K, E>(_keys(obj) as Array<K>)
}
