import { defaults, identity } from 'lodash'

import {
  ValveActionAbort,
  ValveActionError,
  ValveActionType,
  ValveCreateSinkOptions,
  ValveError,
  ValveFindOptions,
  ValveSink
} from '../types'

import { createSink, createSinkDefaultOptions } from '../utilities'

export function find<P, E = ValveError>(
  options: ValveFindOptions<P> & Partial<ValveCreateSinkOptions<P, E>> = {}
): ValveSink<P, E> {
  let ended = false

  const _options = defaults({}, options, createSinkDefaultOptions, {
    predicate: identity
  })

  const once = (f: typeof _options.onError | typeof _options.onAbort) => (
    action: ValveActionError<E> | ValveActionAbort
  ) => {
    if (!ended) {
      f(action)
    }
  }

  // tslint:disable-next-line no-unnecessary-local-variable
  const sink = createSink<P, E>({
    onData(action) {
      // tslint:disable-next-line strict-boolean-expressions
      if (_options.predicate(action.payload)) {
        ended = true

        _options.onData({
          type: ValveActionType.Data,
          payload: action.payload
        })

        sink.abort({ type: ValveActionType.Abort })
      }
    },
    onError: once(_options.onError),
    onAbort: once(_options.onAbort)
  })

  return sink
}
