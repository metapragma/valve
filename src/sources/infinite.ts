import { ValveSource, ValveType } from '../types'

export function infinite(): ValveSource<number>
export function infinite<P>(generate?: () => P): ValveSource<P>
export function infinite<P = number>(
  generate?: () => P
): ValveSource<P | number> {
  const f =
    typeof generate === 'undefined'
      ? // tslint:disable-next-line insecure-random
        Math.random
      : generate

  return {
    type: ValveType.Source,
    source(end, cb) {
      if (end) return cb(end)

      return cb(false, f())
    }
  }
}
