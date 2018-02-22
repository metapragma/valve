// import { ValveError, ValveSink, ValveType } from '../types'

import {
  ValveAbortFunction,
  ValveError,
  ValveSink,
  ValveSource,
  ValveType
} from '../types'

import { drain } from './drain'

import { assign, isUndefined } from 'lodash'

import { isDataAvailable } from '../util/isDataAvailable'

export function reduce<P, E = Error>(
  reducer: (accumulator: P, data: P) => P,
  cb: (end: ValveError<E>, accumulator?: P) => void,
  accumulator?: P
): ValveSink<P, E>

export function reduce<P, R, E = Error>(
  reducer: (accumulator: R, data: P) => R,
  cb: (end: ValveError<E>, accumulator?: R) => void,
  accumulator?: R
): ValveSink<P, E>

export function reduce<P, R, E = Error>(
  reducer: (accumulator: P | R, data: P) => P | R,
  cb: (end: ValveError<E>, accumulator?: P | R) => void,
  accumulator?: P | R
): ValveSink<P, E> {
  let acc: P | R

  if (!isUndefined(accumulator)) {
    acc = accumulator
  }

  const sink = drain<P, E>(
    data => {
      acc = reducer(acc, data)
    },
    err => {
      cb(err, acc)
    }
  )

  if (isUndefined(accumulator)) {
    return {
      type: ValveType.Sink,
      sink: assign<
        (source: ValveSource<P, E>) => void,
        { abort: ValveAbortFunction<P, E> }
      >(
        source => {
          source.source(false, (end, data) => {
            // if ended immediately, and no initial...
            if (!isDataAvailable(end, data)) {
              return cb(end === true ? false : end)
            } else {
              acc = data

              sink.sink(source)
            }
          })
        },
        {
          abort: sink.sink.abort
        }
      )
    }
  } else {
    acc = accumulator

    return sink
  }
}
