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
    next(next) {
      if (first && isUndefined(_options.accumulator)) {
        acc = next
      } else {
        // tslint:disable-next-line no-unsafe-any
        acc = _options.iteratee(acc, next)
      }

      first = false
    },
    complete() {
      if (first && isUndefined(_options.accumulator)) {
        _options.complete()
      } else {
        _options.next(acc)
      }
    },
    error: _options.error
  }))
}
