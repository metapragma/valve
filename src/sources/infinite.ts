import { ValveActionType, ValveError, ValveSource } from '../types'

import { createSource } from '../utilities'

export function infinite<P, E = ValveError>(): ValveSource<number, E>
export function infinite<P, E = ValveError>(
  generate?: () => P
): ValveSource<P, E>
export function infinite<P = number, E = ValveError>(
  generate?: () => P
): ValveSource<P | number, E> {
  const f =
    typeof generate === 'undefined'
      ? // tslint:disable-next-line insecure-random
        Math.random
      : generate

  return createSource<P | number, E>({
    onPull(_, cb) {
      cb({
        type: ValveActionType.Data,
        payload: f()
      })
    }
  })
}
