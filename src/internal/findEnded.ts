import { ValveMessage, ValveMessageComplete, ValveMessageError } from '../types'

import { hasEnded } from './hasEnded'
import { compact, find } from 'lodash'

export const findEnded = <P, E>(
  ...actions: Array<undefined | ValveMessage<P, E>>
): ValveMessageComplete | ValveMessageError<E> | undefined =>
  // tslint:disable-next-line no-any no-unsafe-any
  find<any>(compact(actions), hasEnded)
