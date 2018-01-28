import { ValveSource, ValveType } from '../types'

export function count(max = Infinity): ValveSource<number> {
  let i = 0

  return {
    type: ValveType.Source,
    source(end, cb) {
      if (end) {
        return cb(end)
      }
      if (i >= max) {
        return cb(true)
      }

      cb(false, (i += 1))
    }
  }
}
