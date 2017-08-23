import {
  StreamSource
} from '../types'

export function infinite (): StreamSource<number>
export function infinite <P = number>(generate?: () => P): StreamSource<P | number> {
  const f = (typeof generate === 'undefined')
    // tslint:disable-next-line insecure-random
    ? Math.random
    : generate

  return (end, cb) => {
    if (end) return cb && cb(end)

    return cb(null, f())
  }
}
