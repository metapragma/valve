'use strict'

import { values } from '../sources/values'
import { once } from '../sources/once'

// convert a stream of arrays or streams into just a stream.

import {
  ValveActionType,
  ValveSource,
  ValveSourceCallback,
  ValveThrough,
  ValveType
} from '../types'

import { isArray, isPlainObject, isUndefined, noop } from 'lodash'

import { hasEnded } from '../utilities'

// TODO: use helpers
//
export function flatten<S, E = Error>(): ValveThrough<
  ValveSource<S, E> | S[] | S,
  S,
  E
> {
  return {
    type: ValveType.Through,
    terminate: noop,
    sink(source) {
      // read
      let _source: ValveSource<S, E> | undefined

      return {
        type: ValveType.Source,
        source(action, cb) {
          if (hasEnded(action)) {
            // abort the current stream, and then stream of streams.
            !isUndefined(_source)
              ? _source.source(action, _action => {
                  source.source(
                    hasEnded(_action) ? _action : action,
                    cb as ValveSourceCallback<{}, E>
                  )
                })
              : source.source(action, cb as ValveSourceCallback<{}, E>)
          } else if (!isUndefined(_source)) {
            nextChunk()
          } else {
            nextStream()
          }

          function nextChunk() {
            if (!isUndefined(_source)) {
              _source.source({ type: ValveActionType.Pull }, _action => {
                if (_action.type === ValveActionType.Abort) {
                  nextStream()
                } else if (_action.type === ValveActionType.Error) {
                  source.source(_action, _ => {
                    // TODO: what do we do with the abortErr?

                    cb(_action)
                  })
                } else {
                  cb(_action)
                }
              })
            }
          }

          function nextStream() {
            _source = undefined

            source.source({ type: ValveActionType.Pull }, _action => {
              if (hasEnded(_action)) {
                return cb(_action)
              }

              function isSource(x: ValveSource<{}, E>): x is ValveSource<S, E> {
                return isPlainObject(x) && x.type === ValveType.Source
              }

              if (isArray(_action.payload)) {
                _source = values(_action.payload)
              } else if (isSource(_action.payload as ValveSource<S, E>)) {
                _source = _action.payload as ValveSource<S, E>
                // } else if (isPlainObject(stream)) {
                //   _source = values(stream as O)
              } else {
                // tslint:disable-next-line no-parameter-reassignment
                _source = once(_action.payload as S)
              }

              nextChunk()
            })
          }
        }
      }
    }
  }
}
