import { ValveError, ValveSourceFactory } from '../types'

import { Source } from '../internal/Source'

// TODO: better random
export function infinite<
  P,
  E extends ValveError = ValveError
>(): ValveSourceFactory<number, {}, E>
export function infinite<P, E extends ValveError = ValveError>(
  generate?: () => P
): ValveSourceFactory<P, {}, E>
export function infinite<P = number, E extends ValveError = ValveError>(
  generate?: () => P
): ValveSourceFactory<P | number, {}, E> {
  const f =
    typeof generate === 'undefined'
      ? // tslint:disable-next-line insecure-random
        Math.random
      : generate

  return Source.of<P | number, {}, E>(({ next }) => ({
    pull() {
      next(f())
    }
  }))
}
