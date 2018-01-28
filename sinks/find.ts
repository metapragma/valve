import { drain } from './drain'

import { identity } from 'lodash'

import { ValveCallback, ValveSink } from '../types'

export function find<P, E = Error>(
  cb: ValveCallback<P, E>,
  test: ((data: P) => boolean) = identity
): ValveSink<P, E> {
  let ended = false

  return drain(
    data => {
      if (test(data)) {
        ended = true
        cb(false, data)

        return false
      }
    },
    err => {
      if (ended) return // already called back
      // cb(err === true ? null : err, null)
      cb(err)
    }
  )
}
