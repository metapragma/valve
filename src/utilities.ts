/* tslint:disable no-unnecessary-callback-wrapper */

import {
  ValveAction,
  ValveActionAbort,
  ValveActionError,
  ValveActionType,
  ValveCallback,
  ValveCallbackAbort,
  ValveCallbackError,
  ValveCreateSinkOptions,
  ValveCreateSourceOptions,
  ValveError,
  ValveSink,
  ValveSinkAction,
  ValveSinkCallbacks,
  ValveSinkFactory,
  ValveSource,
  ValveSourceAction,
  ValveSourceCallbacks,
  ValveSourceFactory,
  ValveThrough,
  ValveThroughFactory,
  ValveType
} from './types'

import { assign, compact, defaults, find, isUndefined, noop } from 'lodash'

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
    : action.type === ValveActionType.Abort || action.type === ValveActionType.Error

const findEnded = <P, E = ValveError>(
  ...actions: Array<undefined | ValveAction<P, E>>
): ValveActionAbort | ValveActionError<E> | undefined =>
  find<ValveAction<P, E>, ValveActionAbort | ValveActionError<E>>(compact(actions), hasEnded)

export const createSource = <T, E = ValveError>(
  handler: (
    actions: ValveSourceCallbacks<T, E>
  ) => Partial<ValveCreateSourceOptions<E>> = () => ({})
): ValveSourceFactory<T, E> =>
  assign<() => ValveSource<T, E>, { type: ValveType.Source }>(
    () => {
      let cb: ValveCallback<T, E>

      const actions: ValveSourceCallbacks<T, E> = {
        abort: () => cb({ type: ValveActionType.Abort }),
        data: data => cb({ type: ValveActionType.Data, payload: data }),
        error: error => cb({ type: ValveActionType.Error, payload: error }),
        noop: () => cb({ type: ValveActionType.Noop })
        // pull: () => cb({ type: ValveActionType.Pull }),
      }

      const defaultOptions: ValveCreateSourceOptions<E> = {
        onAbort: () => actions.abort(),
        onError: error => actions.error(error),
        onPull: () => actions.abort()
      }

      const opts: ValveCreateSourceOptions<E> = defaults({}, handler(actions), defaultOptions)

      return (action, _cb) => {
        cb = _cb

        switch (action.type) {
          case ValveActionType.Abort:
            opts.onAbort()

            break
          case ValveActionType.Error:
            opts.onError(action.payload)
            break
          case ValveActionType.Pull:
            opts.onPull()
        }
      }
    },
    { type: ValveType.Source }
  )

export const createSinkDefaultOptions = {
  onAbort: noop,
  onError: noop,
  onData: noop
}

const scheduler = (tick: () => boolean): void => {
  let loop = true

  while (loop) {
    loop = tick()
  }

  // const next = () => process.nextTick(() => {
  //   if (loop) {
  //     loop = tick()
  //
  //     next()
  //   }
  // })

  // next()
}

export const createSink = <T, E = ValveError>(
  handler: (
    actions: {
      abort: ValveCallbackAbort
      error: ValveCallbackError<E>
    }
  ) => Partial<ValveCreateSinkOptions<T, E>> = () => createSinkDefaultOptions
): ValveSinkFactory<T, E> =>
  assign<() => ValveSink<T, E>, { type: ValveType.Sink }>(
    () => {
      let ended: ValveSinkAction<E> | undefined

      const actions = {
        abort() {
          ended = findEnded<T, E>(ended, { type: ValveActionType.Abort })
        },
        error(error: E) {
          ended = findEnded<T, E>(ended, { type: ValveActionType.Error, payload: error })
        }
      }

      const options: ValveCreateSinkOptions<T, E> = defaults(
        {},
        handler(actions),
        createSinkDefaultOptions
      )

      return source => {
        // this function is much simpler to write if you just use recursion,
        // but by using a while loop we do not blow the stack if the stream
        // happens to be sync.

        const next = (): void => {
          let loop = true
          let hasResponded = false

          const tick = () => {
            hasResponded = false

            source(isUndefined(ended) ? { type: ValveActionType.Pull } : ended, action => {
              hasResponded = true

              switch (action.type) {
                case ValveActionType.Abort: {
                  loop = false

                  actions.abort()

                  options.onAbort()

                  break
                }
                case ValveActionType.Error: {
                  loop = false

                  actions.error(action.payload)

                  options.onError(action.payload)

                  break
                }
                case ValveActionType.Noop: {
                  break
                }
                case ValveActionType.Data: {
                  options.onData(action.payload)

                  if (!loop) {
                    next()
                  }
                }
              }
            })

            if (!hasResponded) {
              loop = false

              return loop
            }

            return loop
          }

          scheduler(tick)
        }

        next()
      }
    },
    { type: ValveType.Sink }
  )

// tslint:disable-next-line max-func-body-length
export const createThrough = <T, R = T, E = ValveError>(
  sourceHandler: (
    actions: ValveSourceCallbacks<R, E>
  ) => Partial<ValveCreateSinkOptions<T, E>> = () => ({}),
  sinkHandler: (actions: ValveSinkCallbacks<E>) => Partial<ValveCreateSourceOptions<E>> = () => ({})
): ValveThroughFactory<T, R, E> =>
  assign<() => ValveThrough<T, R, E>, { type: ValveType.Through }>(
    // tslint:disable-next-line max-func-body-length
    () => {
      // TODO: passthrough by default
      let sourceCb: ValveCallback<R, E>
      let sinkSource: ValveSource<T, E>
      // tslint:disable-next-line no-any
      let sinkCb: (_action: ValveSourceAction<any, any, E>) => void

      const sourceActions: ValveSourceCallbacks<R, E> = {
        abort: () => sourceCb({ type: ValveActionType.Abort }),
        data: data => sourceCb({ type: ValveActionType.Data, payload: data }),
        error: error => sourceCb({ type: ValveActionType.Error, payload: error }),
        noop: () => sourceCb({ type: ValveActionType.Noop })
      }

      const sinkActions: ValveSinkCallbacks<E> = {
        abort: () => sinkSource({ type: ValveActionType.Abort }, sinkCb),
        error: error => sinkSource({ type: ValveActionType.Error, payload: error }, sinkCb),
        pull: () => sinkSource({ type: ValveActionType.Pull }, sinkCb)
      }

      const sourceOpts: ValveCreateSinkOptions<R, E> = defaults({}, sourceHandler(sourceActions), {
        onAbort() {
          sourceActions.abort()
        },
        onError(error: E) {
          sourceActions.error(error)
        },
        onData(data: R) {
          sourceActions.data(data)
        }
      })

      const sinkOpts: ValveCreateSourceOptions<E> = defaults({}, sinkHandler(sinkActions), {
        onAbort() {
          sinkActions.abort()
        },
        onError(error: E) {
          sinkActions.error(error)
        },
        onPull() {
          sinkActions.pull()
        }
      })

      const sourceActionHandler = (
        // tslint:disable-next-line no-any
        action: ValveSourceAction<any, any, E>,
        cb: ValveCallback<R, E>
      ) => {
        sourceCb = cb

        switch (action.type) {
          case ValveActionType.Data: {
            // tslint:disable no-unsafe-any
            sourceOpts.onData(action.payload)
            break
          }
          case ValveActionType.Abort: {
            sourceOpts.onAbort()
            break
          }
          case ValveActionType.Error: {
            sourceOpts.onError(action.payload)
            break
          }
          default: {
            cb(action)
          }
        }
      }

      const sinkActionHandler = (
        action: ValveSinkAction<E>,
        cb: ValveCallback<R, E>,
        source: ValveSource<T, E>
      ) => {
        sinkCb = _action => sourceActionHandler(_action, cb)
        sinkSource = source

        switch (action.type) {
          case ValveActionType.Pull: {
            sinkOpts.onPull()
            break
          }
          case ValveActionType.Abort: {
            sinkOpts.onAbort()
            break
          }
          case ValveActionType.Error: {
            sinkOpts.onError(action.payload)
          }
        }
      }

      return source => (action, cb) => {
        sinkActionHandler(action, cb, source)
      }
    },
    { type: ValveType.Through }
  )
