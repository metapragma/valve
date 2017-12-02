import {
  ValveAbort,
  ValveCallback,
  ValveError,
  ValveSourceFunction
} from '../types'

export function abortCb <P, E = Error>(
  cb: ValveCallback<P, E>,
  abort: ValveAbort<E>,
  onAbort?: (abort: ValveError<E>) => void
) {
  cb(abort)

  if (typeof onAbort !== 'undefined') {
    onAbort(abort === true ? null : abort)
  }
}
