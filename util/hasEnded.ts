import { isBoolean, isNull, isUndefined } from 'lodash'

export const hasEnded = <E>(e: boolean | E) =>
  isBoolean(e) || isNull(e) || isUndefined(e) ? !(Boolean(e) === false) : true
