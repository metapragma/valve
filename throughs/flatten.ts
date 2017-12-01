'use strict'

import { values } from '../sources/values'
import { once } from '../sources/once'

// convert a stream of arrays or streams into just a stream.

import {
  IStreamSource,
  IStreamThrough,
  StreamAbort,
  StreamCallback,
  StreamType
} from '../types'

// export function flatten <P, E = Error>(
// ): IStreamSource<P, E>
//
// export function flatten <P, K extends keyof P, E = Error>(
// ): IStreamSource<P[K], E>
//
// export function flatten <P, K extends keyof P, E = Error>(
// ): IStreamSource<P[K], E>

import {
  isArray,
  isPlainObject,
  noop
} from 'lodash'


// export function flatten <S, E = Error>(): IStreamThrough<IStreamSource<S, E>, S, E>
// export function flatten <S, E = Error>(): IStreamThrough<S[], S, E>
// export function flatten <O, K extends keyof O, E = Error>(): IStreamThrough<O, O[K], E>
export function flatten <
  S,
  E = Error
>(): IStreamThrough<
  IStreamSource<S, E> | S[] | S,
  S,
  E
> {
  return {
    type: StreamType.Through,
    sink (source) { // read
      let _source: IStreamSource<S, E>

      return {
        type: StreamType.Source,
        source (abort, cb) {
          if (abort) {
            // abort the current stream, and then stream of streams.
            _source
              ? _source.source(abort, err => {
                source.source(err || abort, cb as StreamCallback<{}, E>)
              })
              : source.source(abort, cb as StreamCallback<{}, E>)
          } else if (_source) {
            nextChunk()
          } else {
            nextStream()
          }

          function nextChunk() {
            _source.source(null, (err, data) => {
              if (err === true) {
                nextStream()
              } else if (err) {
                source.source(true, _ => {
                  // TODO: what do we do with the abortErr?

                  cb(err)
                })
              } else {
                cb(null, data)
              }
            })
          }

          function nextStream() {
            _source = null

            source.source(null, (end, stream) => {
              if (end) return cb(end)

              function isSource(x: IStreamSource<{}, E>): x is IStreamSource<S, E> {
                return isPlainObject(x) && x.type === StreamType.Source
              }

              if (isArray(stream)) {
                _source = values(stream)
              } else if (isSource(stream as IStreamSource<S, E>)) {
                _source = stream as IStreamSource<S, E>
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
