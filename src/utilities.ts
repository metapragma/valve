import {
  ValveAction,
  ValveActionAbort,
  ValveActionError,
  ValveActionType,
  ValveCreateSinkOptions,
  ValveCreateSourceOptions,
  ValveCreateThroughDownOptions,
  ValveCreateThroughOptions,
  ValveCreateThroughUpOptions,
  ValveError,
  ValveSink,
  ValveSinkAction,
  ValveSource,
  ValveSourceAction,
  ValveSourceCallback,
  ValveThrough,
  ValveType
} from './types'

import {
  compact,
  defaults,
  defaultsDeep,
  find,
  isUndefined,
  noop
} from 'lodash'

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

const findEnded = <P, E = ValveError>(
  ...actions: Array<undefined | ValveAction<P, E>>
): ValveActionAbort | ValveActionError<E> | undefined =>
  find<ValveAction<P, E>, ValveActionAbort | ValveActionError<E>>(
    compact(actions),
    hasEnded
  )

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
      switch (action.type) {
        case ValveActionType.Abort:
          _options.onAbort(action, cb)

          break
        case ValveActionType.Error:
          _options.onError(action, cb)
          break
        case ValveActionType.Pull:
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

  let ended: ValveSinkAction<E> | undefined

  return {
    type: ValveType.Sink,
    terminate: (action = { type: ValveActionType.Abort }) => {
      ended = findEnded<T, E>(ended, action)
    },
    sink: source => {
      // this function is much simpler to write if you
      // just use recursion, but by using a while loop
      // we do not blow the stack if the stream happens to be sync.

      const next = (): void => {
        let loop = true
        let cbed = false

        while (loop) {
          cbed = false

          source.source(
            isUndefined(ended) ? { type: ValveActionType.Pull } : ended,
            action => {
              cbed = true

              switch (action.type) {
                case ValveActionType.Abort: {
                  loop = false

                  ended = action

                  _options.onAbort(action)

                  break
                }
                case ValveActionType.Error: {
                  loop = false

                  ended = action

                  _options.onError(action)

                  break
                }
                case ValveActionType.Noop: {
                  break
                }
                case ValveActionType.Data: {
                  _options.onData(action)

                  if (!loop) {
                    next()
                  }
                }
              }
            }
          )

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

// tslint:disable-next-line max-func-body-length
export const createThrough = <T, R = T, E = ValveError>(
  options: Partial<{
    up: Partial<ValveCreateThroughUpOptions<T, R, E>>
    down: Partial<ValveCreateThroughDownOptions<T, R, E>>
  }> = {}
): ValveThrough<T, R, E> => {
  // tslint:disable-next-line no-any
  const defaultOptions: ValveCreateThroughOptions<T, any, E> = {
    up: {
      onAbort(action, cb, source) {
        source.source(action, cb)
      },
      onError(action, cb, source) {
        source.source(action, cb)
      },
      onPull(action, cb, source) {
        source.source(action, cb)
      }
    },
    down: {
      onAbort(action, cb) {
        cb(action)
      },
      onError(action, cb) {
        cb(action)
      },
      onData(action, cb) {
        cb(action)
      }
    }
  }

  // tslint:disable-next-line no-unsafe-any
  const _options: ValveCreateThroughOptions<T, R, E> = defaultsDeep(
    {},
    options,
    defaultOptions
  )

  const sourceActionHandler = (
    // tslint:disable-next-line no-any
    action: ValveSourceAction<any, E>,
    cb: ValveSourceCallback<R, E>
  ) => {
    switch (action.type) {
      case ValveActionType.Data: {
        _options.down.onData(action, cb)
        break
      }
      case ValveActionType.Abort: {
        _options.down.onAbort(action, cb)
        break
      }
      case ValveActionType.Error: {
        _options.down.onError(action, cb)
        break
      }
      default: {
        cb(action)
      }
    }
  }

  const sinkActionHandler = (
    action: ValveSinkAction<E>,
    cb: ValveSourceCallback<R, E>,
    source: ValveSource<T, E>
  ) => {
    switch (action.type) {
      case ValveActionType.Pull: {
        _options.up.onPull(
          action,
          _action => sourceActionHandler(_action, cb),
          source
        )
        break
      }
      case ValveActionType.Abort: {
        _options.up.onAbort(
          action,
          _action => sourceActionHandler(_action, cb),
          source
        )
        break
      }
      case ValveActionType.Error: {
        _options.up.onError(
          action,
          _action => sourceActionHandler(_action, cb),
          source
        )
      }
    }
  }

  return {
    type: ValveType.Through,
    sink(source) {
      return {
        type: ValveType.Source,
        source(action, cb) {
          sinkActionHandler(action, cb, source)
        }
      }
    }
  }
}
