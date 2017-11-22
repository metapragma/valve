/* tslint:disable no-increment-decrement */

import 'setimmediate'

import {
  drain,
  map,
  pull,
  take,
  through
} from '../index'

import {
  IStreamSource,
  IStreamThrough,
  StreamAbort,
  StreamCallback,
  StreamSink,
  StreamSinkAbort,
  StreamSource,
  StreamThrough,
  StreamType
} from '../types'

import {
  assign,
  noop
} from 'lodash'

import tape = require('tape')

function hang<P, E>(values: P[], onAbort?: () => void): IStreamSource<P, E> {
  let i = 0
  let _cb: StreamCallback<P, E>

  return {
    type: StreamType.Source,
    source (abort, cb) {
      if (i < values.length) {
        cb(null, values[i++])
      } else if (!abort) {
        _cb = cb
      } else {
        _cb(abort)
        cb(abort) // ??
        // tslint:disable-next-line no-unused-expression
        onAbort && onAbort()
      }
    }
  }
}

// interface LocalStreamThrough<P, R, E = Error> {
//   (source: StreamSource<P, E>): (abort: StreamAbort<E>, cb: StreamCallback<R, E>) => void
//   abort?: StreamSinkAbort<P, E>
// }

function abortable<P, E>(): IStreamThrough<P, P, E> {
  let _read: IStreamSource<P, E>
  let aborted: StreamAbort<E>

  const reader: IStreamThrough<P, P, E> = {
    type: StreamType.Through,
    sink (read) {
      _read = read

      return {
        type: StreamType.Source,
        source (abort: StreamAbort<E>, cb: StreamCallback<P, E>) {
          if (abort) aborted = abort
          read.source(abort, cb)
        }
      }
    }
  }

  reader.sink.abort = (_, cb) => {
    if (!cb) {
      cb = err => {
        if (err && err !== true) throw err
      }
    }
    // cb = cb || (err) => {
    //   if (err && err !== true) throw err
    // }

    if (aborted) {
      cb(aborted)
    } else {
      _read.source(true, cb)
    }
  }

  return reader
}

function test <E>(name: string, trx: IStreamThrough<number, number, E>) {
  tape(`test abort: + ${name}`, t => {
    const a = abortable()
    // const s: StreamSource<number, E> = hang([1, 2, 3], () => {
    //     t.end()
    //   })

    const s = (): IStreamSource<number, E> => hang([1, 2, 3], () => {
      t.end()
    })


    pull(
      s(),
      trx,
      a,
      drain(e => {
        if (e === 3) {
          setImmediate(() => {
            a.sink.abort()
          })
        }
      },
        err => { t.notOk(err) }
      )
    )
  })
}

test('through', through(e => e))
test('map', map(e => e))
test('take', take(Boolean))
