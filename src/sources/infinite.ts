import { ValveError, ValveSourceFactory } from '../types'

import { createSource } from '../utilities'

export function infinite<P, E = ValveError>(): ValveSourceFactory<number, {}, E>
export function infinite<P, E = ValveError>(generate?: () => P): ValveSourceFactory<P, {}, E>
export function infinite<P = number, E = ValveError>(
  generate?: () => P
): ValveSourceFactory<P | number, {}, E> {
  const f =
    typeof generate === 'undefined'
      ? // tslint:disable-next-line insecure-random
        Math.random
      : generate

  return createSource<P | number, {}, E>(({ data }) => ({
    onPull() {
      data(f())
    }
  }))
}
