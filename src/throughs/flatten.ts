'use strict'

import { fromIterable } from '../sources/fromIterable'
import { once } from '../sources/once'

// convert a stream of arrays or streams into just a stream.

import {
  ValveActionType,
  ValveSource,
  ValveSourceAction,
  ValveSourceCallback,
  ValveThrough,
  ValveType
} from '../types'

import { isArray, isPlainObject, isUndefined } from 'lodash'

import { createThrough } from '../utilities'

export function flatten<S, E = Error>(): ValveThrough<
  ValveSource<S, E> | S[] | S,
  S,
  E
> {
  let _source: ValveSource<S, E> | undefined

  function isSource(x: ValveSource<{}, E>): x is ValveSource<S, E> {
    return isPlainObject(x) && x.type === ValveType.Source
  }

  return createThrough({
    up: {
      onPull(action, cb, source) {
        if (!isUndefined(_source)) {
          _source.source(action, _action => {
            switch (_action.type) {
              case ValveActionType.Abort:
                _source = undefined
                cb({ type: ValveActionType.Noop })
                break
              case ValveActionType.Error:
                _source = undefined
                cb(_action)
                break
              default:
                cb(_action)
            }
          })
        } else {
          source.source(action, cb as ValveSourceCallback<{}, E>)
        }
      }
    },
    down: {
      onAbort(action, cb) {
        if (!isUndefined(_source)) {
          _source.source(action, cb)
        } else {
          cb(action)
        }
      },
      onError(action, cb) {
        if (!isUndefined(_source)) {
          _source.source(action, cb)
        } else {
          cb(action)
        }
      },
      onData(action, cb) {
        if (!isUndefined(_source)) {
          cb(action as ValveSourceAction<S, E>)
        } else {
          if (isArray(action.payload)) {
            _source = fromIterable(action.payload)
          } else if (isSource(action.payload as ValveSource<S, E>)) {
            _source = action.payload as ValveSource<S, E>
          } else {
            _source = once(action.payload as S)
          }

          cb({ type: ValveActionType.Noop })
        }
      }
    }
  })
}
