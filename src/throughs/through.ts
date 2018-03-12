// a pass through stream that doesn't change the value.

import {
  ValveActionAbort,
  ValveActionData,
  ValveActionError,
  ValveError,
  ValveThrough
} from '../types'

import { createThrough } from '../utilities'

import { isFunction } from 'lodash'

export function through<P, E = ValveError>(
  options: {
    onAbort?(action: ValveActionAbort): void
    onError?(action: ValveActionError<E>): void
    onData?(action: ValveActionData<P>): void
  } = {}
): ValveThrough<P, P, E> {
  return createThrough<P, P, E>({
    down: {
      onAbort(action, cb) {
        if (isFunction(options.onAbort)) {
          options.onAbort(action)
        }

        cb(action)
      },
      onError(action, cb) {
        if (isFunction(options.onError)) {
          options.onError(action)
        }

        cb(action)
      },
      onData(action, cb) {
        if (isFunction(options.onData)) {
          options.onData(action)
        }

        cb(action)
      }
    }
  })
}
