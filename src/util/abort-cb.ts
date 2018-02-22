import { ValveAbort, ValveCallback, ValveError } from '../types'

export function abortCb<P, E = Error>(
  cb: ValveCallback<P, E>,
  abort: ValveAbort<E>,
  onAbort?: (abort: ValveError<E>) => void
) {
  cb(abort)

  if (typeof onAbort !== 'undefined') {
    onAbort(abort === true ? false : abort)
  }
}
