import {
  StreamSource
} from '../types'

export function count (max?: number): StreamSource<number> {
  let i = 0
  max = max || Infinity

  return (end, cb) => {
    if (end) return cb && cb(end)
    if (i > max) return cb(true)
    cb(null, i+=1)
  }
}
