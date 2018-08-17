/* tslint:disable no-unnecessary-callback-wrapper max-func-body-length */

import {
  Observable,
  Observer,
  ValveActionComplete,
  ValveActionError,
  ValveCallback,
  ValveCreateSinkOptions,
  ValveCreateSourceOptions,
  ValveError,
  ValveMessage,
  ValveMessageComplete,
  ValveMessageError,
  ValveMessageType,
  ValveSink,
  ValveSinkAction,
  ValveSinkFactory,
  ValveSinkMessage,
  ValveSource,
  ValveSourceAction,
  ValveSourceFactory,
  ValveSourceMessage,
  ValveState,
  ValveStream,
  ValveThrough,
  ValveThroughFactory,
  ValveType
} from './types'

import {
  assign,
  compact,
  defaults,
  find,
  forEach,
  isFunction,
  isUndefined,
  noop,
  pull
} from 'lodash'

export const hasEnded = <E>(
  action:
    | undefined
    | {
        type: ValveMessageType
        // tslint:disable-next-line no-any
        [key: string]: any
      }
): action is ValveMessageComplete | ValveMessageError<E> =>
  isUndefined(action)
    ? false
    : action.type === ValveMessageType.Complete ||
      action.type === ValveMessageType.Error

const findEnded = <P, E>(
  ...actions: Array<undefined | ValveMessage<P, E>>
): ValveMessageComplete | ValveMessageError<E> | undefined =>
  // tslint:disable-next-line no-any no-unsafe-any
  find<any>(compact(actions), hasEnded)

export const createSource = <
  T,
  S = ValveState,
  E extends ValveError = ValveError
>(
  handler: (
    actions: ValveSourceAction<T, E>
  ) => Partial<ValveCreateSourceOptions<E>> = () => ({})
): ValveSourceFactory<T, S, E> =>
  assign<() => ValveSource<T, E>, { type: ValveType.Source }>(
    () => {
      let cb: ValveCallback<T, E>

      const actions: ValveSourceAction<T, E> = {
        complete: () => cb({ type: ValveMessageType.Complete }),
        next: next => cb({ type: ValveMessageType.Next, payload: next }),
        error: error => cb({ type: ValveMessageType.Error, payload: error }),
        noop: () => cb({ type: ValveMessageType.Noop })
        // pull: () => cb({ type: ValveMessageType.Pull }),
      }

      const defaultOptions: ValveCreateSourceOptions<E> = {
        complete: () => actions.complete(),
        error: error => actions.error(error),
        pull: () => actions.complete()
      }

      const opts: ValveCreateSourceOptions<E> = defaults(
        {},
        handler(actions),
        defaultOptions
      )

      return (action, _cb) => {
        cb = _cb

        switch (action.type) {
          case ValveMessageType.Complete:
            opts.complete()

            break
          case ValveMessageType.Error:
            opts.error(action.payload)
            break
          case ValveMessageType.Pull:
            opts.pull()
        }
      }
    },
    { type: ValveType.Source }
  )

const dumb = (tick: () => boolean): void => {
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

export const createSink = <
  T,
  R,
  S = ValveState,
  E extends ValveError = ValveError
>(
  handler: (
    actions: {
      complete: ValveActionComplete
      error: ValveActionError<E>
      observer: Required<Observer<R, E>>
    }
  ) => Partial<ValveCreateSinkOptions<T, E>> = () => ({})
): ValveSinkFactory<T, R, S, E> =>
  assign<() => ValveSink<T, R, E>, { type: ValveType.Sink }>(
    () => {
      let ended: ValveSinkMessage<E> | undefined
      let source: ValveSource<T, E>
      let scheduler: (tick: () => boolean) => void
      const observers: Array<Observer<R, E>> = []
      // TODO: do not subscribe if no observers

      const fanOut: Required<Observer<R, E>> = {
        // TODO: inneficient
        next(value) {
          forEach(
            observers,
            observer => {
              if (isFunction(observer.next)) {
                observer.next(value)
              }
            }
          )
        },
        complete() {
          forEach(
            observers,
            observer => {
              if (isFunction(observer.complete)) {
                observer.complete()
              }
            }
          )
        },
        error(value) {
          forEach(
            observers,
            observer => {
              if (isFunction(observer.error)) {
                observer.error(value)
              }
            }
          )
        }
      }

      const actions = {
        complete() {
          ended = findEnded<T, E>(ended, { type: ValveMessageType.Complete })
        },
        error(error: E) {
          ended = findEnded<T, E>(ended, {
            type: ValveMessageType.Error,
            payload: error
          })
        },
        observer: fanOut
      }

      const options: ValveCreateSinkOptions<T, E> = defaults(
        {},
        handler(actions),
        {
          complete() {
            fanOut.complete()
          },
          error(value: E) {
            fanOut.error(value)
          },
          next(value: R) {
            fanOut.next(value)
          }
        }
      )

      const next = (): void => {
        // this function is much simpler to write if you just use recursion,
        // but by using a while loop we do not blow the stack if the stream
        // happens to be sync.

        let loop = true
        let hasResponded = false

        const tick = () => {
          hasResponded = false

          source(
            isUndefined(ended) ? { type: ValveMessageType.Pull } : ended,
            action => {
              hasResponded = true

              switch (action.type) {
                case ValveMessageType.Complete: {
                  loop = false

                  actions.complete()

                  options.complete()

                  break
                }
                case ValveMessageType.Error: {
                  loop = false

                  actions.error(action.payload)

                  options.error(action.payload)

                  break
                }
                case ValveMessageType.Noop: {
                  break
                }
                case ValveMessageType.Next: {
                  options.next(action.payload)

                  if (!loop) {
                    next()
                  }
                }
              }
            }
          )

          if (!hasResponded) {
            loop = false

            return loop
          }

          return loop
        }

        if (!isUndefined(scheduler)) {
          scheduler(tick)
        }
      }

      const observable: Observable<R, E> = {
        // tslint:disable-next-line function-name
        [Symbol.observable]() {
          return this
        },
        subscribe(observer) {
          observers.push(observer)

          return {
            unsubscribe() {
              if (observers.length !== 0) {
                pull(observers, observer)
              }
            }
          }
        }
      }

      return _source => {
        source = _source

        return assign<
          { schedule(scheduler: (tick: () => boolean) => void): void },
          Observable<R, E>
        >(
          {
            schedule(_scheduler = dumb) {
              if (isUndefined(scheduler)) {
                scheduler = _scheduler

                next()
              }
            }
          },
          observable
        )
      }
    },
    { type: ValveType.Sink }
  )

// tslint:disable-next-line max-func-body-length
export const createThrough = <
  T,
  R = T,
  S = ValveState,
  E extends ValveError = ValveError
>(
  sourceHandler: (
    actions: ValveSourceAction<R, E>
  ) => Partial<ValveCreateSinkOptions<T, E>> = () => ({}),
  sinkHandler: (
    actions: ValveSinkAction<E>
  ) => Partial<ValveCreateSourceOptions<E>> = () => ({})
): ValveThroughFactory<T, R, S, E> =>
  assign<() => ValveThrough<T, R, E>, { type: ValveType.Through }>(
    // tslint:disable-next-line max-func-body-length
    () => {
      // TODO: passthrough by default
      let sourceCb: ValveCallback<R, E>
      let sinkSource: ValveSource<T, E>
      // tslint:disable-next-line no-any
      let sinkCb: (_action: ValveSourceMessage<any, any, E>) => void

      const sourceActions: ValveSourceAction<R, E> = {
        complete: () => sourceCb({ type: ValveMessageType.Complete }),
        next: next => sourceCb({ type: ValveMessageType.Next, payload: next }),
        error: error =>
          sourceCb({ type: ValveMessageType.Error, payload: error }),
        noop: () => sourceCb({ type: ValveMessageType.Noop })
      }

      const sinkActions: ValveSinkAction<E> = {
        complete: () => sinkSource({ type: ValveMessageType.Complete }, sinkCb),
        error: error =>
          sinkSource({ type: ValveMessageType.Error, payload: error }, sinkCb),
        pull: () => sinkSource({ type: ValveMessageType.Pull }, sinkCb)
      }

      const sourceOpts: ValveCreateSinkOptions<R, E> = defaults(
        {},
        sourceHandler(sourceActions),
        {
          complete() {
            sourceActions.complete()
          },
          error(error: E) {
            sourceActions.error(error)
          },
          next(next: R) {
            sourceActions.next(next)
          }
        }
      )

      const sinkOpts: ValveCreateSourceOptions<E> = defaults(
        {},
        sinkHandler(sinkActions),
        {
          complete() {
            sinkActions.complete()
          },
          error(error: E) {
            sinkActions.error(error)
          },
          pull() {
            sinkActions.pull()
          }
        }
      )

      const sourceActionHandler = (
        // tslint:disable-next-line no-any
        action: ValveSourceMessage<any, any, E>,
        cb: ValveCallback<R, E>
      ) => {
        sourceCb = cb

        switch (action.type) {
          case ValveMessageType.Next: {
            // tslint:disable no-unsafe-any
            sourceOpts.next(action.payload)
            break
          }
          case ValveMessageType.Complete: {
            sourceOpts.complete()
            break
          }
          case ValveMessageType.Error: {
            sourceOpts.error(action.payload)
            break
          }
          default: {
            cb(action)
          }
        }
      }

      const sinkActionHandler = (
        action: ValveSinkMessage<E>,
        cb: ValveCallback<R, E>,
        source: ValveSource<T, E>
      ) => {
        sinkCb = _action => sourceActionHandler(_action, cb)
        sinkSource = source

        switch (action.type) {
          case ValveMessageType.Pull: {
            sinkOpts.pull()
            break
          }
          case ValveMessageType.Complete: {
            sinkOpts.complete()
            break
          }
          case ValveMessageType.Error: {
            sinkOpts.error(action.payload)
          }
        }
      }

      return source => (action, cb) => {
        sinkActionHandler(action, cb, source)
      }
    },
    { type: ValveType.Through }
  )
