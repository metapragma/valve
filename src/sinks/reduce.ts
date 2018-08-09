import {
  ValveCreateSinkOptions,
  ValveError,
  ValveReduceOptions,
  ValveSinkFactory
} from '../types'

import { defaults, isUndefined } from 'lodash'

import { createSink, createSinkDefaultOptions } from '../utilities'

export function reduce<P, R = P, E extends ValveError = ValveError>(
  options: ValveReduceOptions<P, R> & Partial<ValveCreateSinkOptions<R, E>>
): ValveSinkFactory<P, {}, E> {
  let first = true
  // tslint:disable-next-line no-any
  let acc: any

  const _options = defaults({}, options, createSinkDefaultOptions)

  if (!isUndefined(_options.accumulator)) {
    acc = _options.accumulator
  }

  return createSink<P, {}, E>(() => ({
    onData(data) {
      if (first && isUndefined(_options.accumulator)) {
        acc = data
      } else {
        // tslint:disable-next-line no-unsafe-any
        acc = _options.iteratee(acc, data)
      }

      first = false
    },
    onAbort() {
      if (first && isUndefined(_options.accumulator)) {
        _options.onAbort()
      } else {
        _options.onData(acc)
      }
    },
    onError: _options.onError
  }))
}
