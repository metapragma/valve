import { drain } from './drain'

import {
  identity
} from 'lodash'

import {
  ValveCallback,
  ValveSink
} from '../types'

export function find <P, K extends keyof P, E = Error>(
  cb: ValveCallback<P, E>, test?: ((data: P) => boolean)
): ValveSink<P, E> {
  let ended = false

  const tester = test || identity

  return drain(
    data => {
      if (tester(data)) {
        ended = true
        cb(null, data)

        return false
      }
    },
    err => {
      if (ended) return // already called back
      // cb(err === true ? null : err, null)
      cb(err, null)
    }
  )
}
