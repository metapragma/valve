import { ValveError } from '../types'

import { Source } from '../internal/Source'

// TODO: better random
export function infinite<P, E extends ValveError = ValveError>(): Source<
  number,
  E
>
export function infinite<P, E extends ValveError = ValveError>(
  generate?: () => P
): Source<P, E>
export function infinite<P = number, E extends ValveError = ValveError>(
  generate?: () => P
): Source<P | number, E> {
  const f =
    typeof generate === 'undefined'
      ? // tslint:disable-next-line insecure-random
        Math.random
      : generate

  return Source.create(({ next }) => ({
    pull() {
      next(f())
    }
  }))
}
