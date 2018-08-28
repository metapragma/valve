import {
  ValveError,
  ValveHandlerNoopPull,
  ValveSourceFactory,
  ValveState,
  ValveType
} from '../types'

import { normalizeNoopPull, sourceActionsFactory } from './interface'
import { sourceOperator } from './operator'

export const createSource = <
  T,
  S = ValveState,
  E extends ValveError = ValveError
>(
  handler: ValveHandlerNoopPull<T, E> = () => ({})
): ValveSourceFactory<T, S, E> => ({
  pipe() {
    return cb =>
      sourceOperator(normalizeNoopPull(handler, sourceActionsFactory(cb)))
  },
  type: ValveType.Source
})
