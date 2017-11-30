import {
  StreamAbort,
} from '../types'

import {
  noop,
  once as _once
} from 'lodash'

export function once <E = Error>(onAbort?: (abort: StreamAbort<E>) => void): (abort: StreamAbort<E>) => void {
  return _once(onAbort || noop)
}
