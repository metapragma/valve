import {
  ValveMessageComplete,
  ValveMessageError,
  ValveMessageType
} from '../types'

import { isUndefined } from 'lodash'

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
