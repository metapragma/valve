import { ValveAbort } from '../types'
import { isFunction, noop, once as _once } from 'lodash'

export function once<E = Error>(
  onAbort?: (abort: ValveAbort<E>) => void
): (abort: ValveAbort<E>) => void {
  return _once(isFunction(onAbort) ? onAbort : noop)
}
