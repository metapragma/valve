import {
  ValveAction,
  ValveActionAbort,
  ValveActionData,
  ValveActionError,
  ValveActionType,
  ValveCreateSinkOptions,
  ValveCreateSourceOptions,
  ValveCreateThroughOptions,
  ValveError,
  ValveSink,
  ValveSinkAction,
  ValveSource,
  ValveSourceCallback,
  ValveThrough,
  ValveType
} from './types'

import { compact, defaults, find, isUndefined, noop } from 'lodash'

export const hasEnded = <E = ValveError>(
  action:
    | undefined
    | {
        type: ValveActionType
        // tslint:disable-next-line no-any
        [key: string]: any
      }
): action is ValveActionAbort | ValveActionError<E> =>
  isUndefined(action)
    ? false
    : action.type === ValveActionType.Abort ||
      action.type === ValveActionType.Error

export const createSource = <T, E = ValveError>(
  options: Partial<ValveCreateSourceOptions<T, E>> = {}
): ValveSource<T, E> => {
  const defaultOptions: ValveCreateSourceOptions<T, E> = {
    onAbort: (action, cb) => cb(action),
    onError: (action, cb) => cb(action),
    onPull: (_, cb) => cb({ type: ValveActionType.Abort })
  }

  const _options: ValveCreateSourceOptions<T, E> = defaults(
    {},
    options,
    defaultOptions
  )

  return {
    type: ValveType.Source,
    source(action, cb) {
      if (action.type === ValveActionType.Abort) {
        _options.onAbort(action, cb)
      } else if (action.type === ValveActionType.Error) {
        _options.onError(action, cb)
      } else if (action.type === ValveActionType.Pull) {
        _options.onPull(action, cb)
      }
    }
  }
}

export const createSinkDefaultOptions = {
  onAbort: noop,
  onError: noop,
  onData: noop
}

export const createSink = <T, E = ValveError>(
  options: Partial<ValveCreateSinkOptions<T, E>> = {}
): ValveSink<T, E> => {
  const _options: ValveCreateSinkOptions<T, E> = defaults(
    {},
    options,
    createSinkDefaultOptions
  )

  let source: ValveSource<T, E>
  let request: ValveSinkAction<E> = { type: ValveActionType.Pull }

  return {
    type: ValveType.Sink,
    terminate: (action = { type: ValveActionType.Abort }) => {
      request = action
    },
    sink: _source => {
      source = _source

      // this function is much simpler to write if you
      // just use recursion, but by using a while loop
      // we do not blow the stack if the stream happens to be sync.

      const next = (): void => {
        let loop = true
        let cbed = false

        while (loop) {
          cbed = false
          source.source(request, action => {
            cbed = true

            if (action.type === ValveActionType.Abort) {
              loop = false

              _options.onAbort(action)
            } else if (action.type === ValveActionType.Error) {
              loop = false

              _options.onError(action)
            } else {
              _options.onData(action)

              if (!loop) {
                next()
              }
            }
          })

          if (!cbed) {
            loop = false

            return
          }
        }
      }

      next()
    }
  }
}

const findEnded = <P, E = ValveError>(
  ...actions: Array<undefined | ValveAction<P, E>>
): ValveActionAbort | ValveActionError<E> | undefined =>
  find<ValveAction<P, E>, ValveActionAbort | ValveActionError<E>>(
    compact(actions),
    hasEnded
  )

export const createThrough = <T, R = T, E = ValveError>(
  options: Partial<ValveCreateThroughOptions<T, R, E>> = {}
): ValveThrough<T, R, E> => {
  // tslint:disable-next-line no-any
  const defaultOptions: ValveCreateThroughOptions<T, any, E> = {
    onAbort: noop,
    onError: noop,
    onData(action, cb) {
      cb(action)
    }
  }

  const _options: ValveCreateThroughOptions<T, R, E> = defaults(
    {},
    options,
    defaultOptions
  )

  let ended: ValveActionAbort | ValveActionError<E> | undefined
  let cbed: boolean = false

  const processEnded = (cb: ValveSourceCallback<R, E>): void => {
    if (!isUndefined(ended)) {
      if (cbed === false) {
        if (ended.type === ValveActionType.Abort) {
          _options.onAbort(ended)
        } else if (ended.type === ValveActionType.Error) {
          _options.onError(ended)
        }

        cb(ended)

        cbed = true
      }
    }
  }

  return {
    type: ValveType.Through,
    terminate(action = { type: ValveActionType.Abort }) {
      ended = findEnded<T, E>(ended, action)
    },
    sink(source) {
      return {
        type: ValveType.Source,
        source(action, cb) {
          ended = findEnded<T, E>(ended, action)

          source.source(isUndefined(ended) ? action : ended, _action => {
            ended = findEnded<T, E>(ended, action, _action)

            if (!isUndefined(ended)) {
              processEnded(cb)
            } else {
              _options.onData(
                _action as ValveActionData<T>,
                // tslint:disable-next-line variable-name
                __action => {
                  ended = findEnded<R, E>(ended, __action)

                  cb(__action)
                },
                source
              )
            }
          })
        }
      }
    }
  }
}
