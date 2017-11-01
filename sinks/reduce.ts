import {
  StreamSinkAbort,
  StreamAbort,
  StreamSink,
  StreamSource
} from '../types'

import {
  assign,
  noop,
} from 'lodash'

import { drain } from './drain'

export function reduce <P, E = Error>(
  reducer: (acc: P, data: P) => P,
  cb: (end?: StreamAbort<E>, acc?: P) => void
): StreamSink<P, E>

export function reduce <P, R, E = Error>(
  reducer: (acc: R, data: P) => R,
  cb: (end?: StreamAbort<E>, acc?: R) => void,
  acc?: R
): StreamSink<P, E>

export function reduce <P, R, E = Error>(
  reducer: (acc: P | R, data: P) => P | R,
  cb: (end?: StreamAbort<E>, acc?: P | R) => void,
  acc?: P | R
): StreamSink<P, E> {
  const sink = drain<P, E>(
    data => {
      acc = reducer(acc, data)
    },
    err => {
      cb(err, acc)
    }
  )

  if (typeof acc === 'undefined') {
    return source => {
      source(null, (end, data) => {
        // if ended immediately, and no initial...
        if (end) {
          return cb(end === true ? null : end)
        }

        acc = data
        sink(source)
      })
    }
  }
  else {
    return sink
  }
}
