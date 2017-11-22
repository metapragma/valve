import {
  IStreamSource,
  StreamType
} from '../types'

export function infinite (): IStreamSource<number>
export function infinite <P = number>(generate?: () => P): IStreamSource<P | number> {
  const f = (typeof generate === 'undefined')
    // tslint:disable-next-line insecure-random
    ? Math.random
    : generate

  return {
    type: StreamType.Source,
    source(end, cb) {
      if (end) return cb && cb(end)

      return cb(null, f())
    }
  }
}
