import { prop } from '../util/prop'
import { drain } from './drain'

import {
  identity
} from 'lodash'

import {
  IStreamSink,
  StreamCallback
} from '../types'

export function find <P, K extends keyof P, E = Error>(
  cb: StreamCallback<P, E>, test?: K | RegExp | ((data: P) => boolean)
): IStreamSink<P, E> {
  let ended = false

  const tester = prop(test) || identity

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
