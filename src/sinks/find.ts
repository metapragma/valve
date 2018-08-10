import { defaults, identity } from 'lodash'

import {
  ValveCreateSinkOptions,
  ValveError,
  ValveFindOptions,
  ValveMessageType,
  ValveSinkFactory
} from '../types'

import { createSink, createSinkDefaultOptions } from '../utilities'

export function find<P, E extends ValveError = ValveError>(
  /* istanbul ignore next */
  options: ValveFindOptions<P> & Partial<ValveCreateSinkOptions<P, E>> = {}
): ValveSinkFactory<P, {}, E> {
  let ended = false

  const _options = defaults({}, options, createSinkDefaultOptions, {
    predicate: identity
  })

  return createSink<P, {}, E>(({ complete }) => ({
    next(next) {
      // tslint:disable-next-line strict-boolean-expressions
      if (_options.predicate(next)) {
        ended = true

        _options.next(next)

        complete()
      }
    },
    error(error) {
      if (!ended) {
        _options.error(error)
      }
    },
    complete() {
      if (!ended) {
        _options.complete()
      }
    }
  }))
}
