import { defaults, identity } from 'lodash'

import {
  ValveActionType,
  ValveCreateSinkOptions,
  ValveError,
  ValveFindOptions,
  ValveSinkFactory
} from '../types'

import { createSink, createSinkDefaultOptions } from '../utilities'

export function find<P, E = ValveError>(
  /* istanbul ignore next */
  options: ValveFindOptions<P> & Partial<ValveCreateSinkOptions<P, E>> = {}
): ValveSinkFactory<P, E> {
  let ended = false

  const _options = defaults({}, options, createSinkDefaultOptions, {
    predicate: identity
  })

  return createSink<P, E>(({ terminate }) => ({
    onData(data) {
      // tslint:disable-next-line strict-boolean-expressions
      if (_options.predicate(data)) {
        ended = true

        _options.onData(data)

        terminate({ type: ValveActionType.Abort })
      }
    },
    onError(error) {
      if (!ended) {
        _options.onError(error)
      }
    },
    onAbort() {
      if (!ended) {
        _options.onAbort()
      }
    }
  }))
}
