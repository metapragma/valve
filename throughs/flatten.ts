'use strict'

import { values } from '../sources/values'
import { once } from '../sources/once'

// convert a stream of arrays or streams into just a stream.

import { ValveCallback, ValveSource, ValveThrough, ValveType } from '../types'

// export function flatten <P, E = Error>(
// ): IStreamSource<P, E>
//
// export function flatten <P, K extends keyof P, E = Error>(
// ): IStreamSource<P[K], E>
//
// export function flatten <P, K extends keyof P, E = Error>(
// ): IStreamSource<P[K], E>

import { isArray, isPlainObject, isUndefined } from 'lodash'

import { hasEnded } from '../util/hasEnded'

// export function flatten <S, E = Error>(): IStreamThrough<IStreamSource<S, E>, S, E>
// export function flatten <S, E = Error>(): IStreamThrough<S[], S, E>
// export function flatten <O, K extends keyof O, E = Error>(): IStreamThrough<O, O[K], E>
export function flatten<S, E = Error>(): ValveThrough<
  ValveSource<S, E> | S[] | S,
  S,
  E
> {
  return {
    type: ValveType.Through,
    sink(source) {
      // read
      let _source: ValveSource<S, E> | undefined

      return {
        type: ValveType.Source,
        source(abort, cb) {
          if (abort) {
            // abort the current stream, and then stream of streams.
            !isUndefined(_source)
              ? _source.source(abort, err => {
                  source.source(
                    hasEnded(err) || hasEnded(abort),
                    cb as ValveCallback<{}, E>
                  )
                })
              : source.source(abort, cb as ValveCallback<{}, E>)
          } else if (!isUndefined(_source)) {
            nextChunk()
          } else {
            nextStream()
          }

          function nextChunk() {
            if (!isUndefined(_source)) {
              _source.source(false, (err, data) => {
                if (err === true) {
                  nextStream()
                } else if (err) {
                  source.source(true, _ => {
                    // TODO: what do we do with the abortErr?

                    cb(err)
                  })
                } else {
                  cb(false, data)
                }
              })
            }
          }

          function nextStream() {
            _source = undefined

            source.source(false, (end, stream) => {
              if (end) return cb(end)

              function isSource(x: ValveSource<{}, E>): x is ValveSource<S, E> {
                return isPlainObject(x) && x.type === ValveType.Source
              }

              if (isArray(stream)) {
                _source = values(stream)
              } else if (isSource(stream as ValveSource<S, E>)) {
                _source = stream as ValveSource<S, E>
                // } else if (isPlainObject(stream)) {
                //   _source = values(stream as O)
              } else {
                // tslint:disable-next-line no-parameter-reassignment
                _source = once(stream as S)
              }

              nextChunk()
            })
          }
        }
      }
    }
  }
}
