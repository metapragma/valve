import {
  ValveAbort,
} from '../types'

import {
  noop,
  once as _once
} from 'lodash'

export function once <E = Error>(onAbort?: (abort: ValveAbort<E>) => void): (abort: ValveAbort<E>) => void {
  return _once(onAbort || noop)
}
