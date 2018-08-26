import { ValveMessageType } from '../types'

import { isUndefined } from 'lodash'

export const hasEnded = (
  action: undefined | ValveMessageType
): action is ValveMessageType.Complete | ValveMessageType.Error =>
  isUndefined(action)
    ? false
    : action === ValveMessageType.Complete || action === ValveMessageType.Error
