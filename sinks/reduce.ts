import {
  ValveSink,
  ValveError,
  ValveSinkFunction,
  ValveAbortFunction,
  ValveSourceFunction,
  ValveType
} from '../types'

import {
  assign
} from 'lodash'

import { drain } from './drain'

export function reduce <P, E = Error>(
  reducer: (acc: P, data: P) => P,
  cb: (end?: ValveError<E>, acc?: P) => void
): ValveSink<P, E>

export function reduce <P, R, E = Error>(
  reducer: (acc: R, data: P) => R,
  cb: (end?: ValveError<E>, acc?: R) => void,
  acc?: R
): ValveSink<P, E>

export function reduce <P, R, E = Error>(
  reducer: (acc: P | R, data: P) => P | R,
  cb: (end?: ValveError<E>, acc?: P | R) => void,
  acc?: P | R
): ValveSink<P, E> {
  const sink = drain<P, E>(
    data => {
      acc = reducer(acc, data)
    },
    err => {
      cb(err, acc)
    }
  )

  if (typeof acc === 'undefined') {
    return {
      type: ValveType.Sink,
      sink(source) {
        source.source(null, (end, data) => {
          // if ended immediately, and no initial...
          if (end) {
            return cb(end === true ? null : end)
          }

          acc = data
          sink.sink(source)
        })

      }
    }
  }
  else {
    return sink
  }
}
