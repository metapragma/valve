import {
  ValveActionType,
  ValveCreateSinkOptions,
  ValveError,
  ValveReduceOptions,
  ValveSink
} from '../types'

import { defaults, isUndefined } from 'lodash'

import { createSink, createSinkDefaultOptions } from '../utilities'

export function reduce<P, R = P, E = ValveError>(
  options: ValveReduceOptions<P, R> & Partial<ValveCreateSinkOptions<R, E>>
): ValveSink<P, E> {
  let first = true
  // tslint:disable-next-line no-any
  let acc: any

  const _options = defaults({}, options, createSinkDefaultOptions)

  if (!isUndefined(_options.accumulator)) {
    acc = _options.accumulator
  }

  return createSink<P, E>({
    onData(action) {
      if (first && isUndefined(_options.accumulator)) {
        acc = action.payload
      } else {
        // tslint:disable-next-line no-unsafe-any
        acc = _options.iteratee(acc, action.payload)
      }

      first = false
    },
    onAbort() {
      if (first && isUndefined(_options.accumulator)) {
        _options.onAbort({
          type: ValveActionType.Abort
        })
      } else {
        _options.onData({
          type: ValveActionType.Data,
          payload: acc
        })
      }
    },
    onError: _options.onError
  })
}
