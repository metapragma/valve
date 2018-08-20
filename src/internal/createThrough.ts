import {
  ValveCallback,
  ValveCreateSinkOptions,
  ValveCreateSourceOptions,
  ValveError,
  ValveMessageType,
  ValveSinkAction,
  ValveSinkMessage,
  ValveSource,
  ValveSourceAction,
  ValveSourceMessage,
  ValveState,
  ValveThrough,
  ValveThroughFactory,
  ValveType
} from '../types'

import { assign, defaults } from 'lodash'

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
