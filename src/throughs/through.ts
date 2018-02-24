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
    onAbort: options.onAbort,
    onError: options.onError,
    onData(action, cb) {
      if (isFunction(options.onData)) {
        options.onData(action)
      }

      cb(action)
    }
  })
}
