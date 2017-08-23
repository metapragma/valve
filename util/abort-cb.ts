import {
  StreamAbort,
  StreamCallback,
  StreamSource
} from '../types'

export function abortCb <P, E = Error>(
  cb: StreamCallback<P, E>,
  abort: StreamAbort<E>,
  onAbort?: (abort: StreamAbort<E>) => void
) {
  cb(abort)

  if (typeof onAbort !== 'undefined') {
    onAbort(abort === true ? null : abort)
  }
}
