import {
  ValveSource,
  ValveType
} from '../types'

export function count (max?: number): ValveSource<number> {
  let i = 0
  max = max || Infinity

  return {
    type: ValveType.Source,
    source (end, cb) {
      if (end) return cb && cb(end)
      if (i >= max) return cb(true)
      cb(null, i+=1)
    }
  }
}
