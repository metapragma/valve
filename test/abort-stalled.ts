/* tslint:disable no-increment-decrement */

import {
  drain,
  map,
  pull,
  take,
  through
} from '../index'

import {
  StreamAbort,
  StreamCallback,
  StreamSink,
  StreamSinkAbort,
  StreamSource,
  StreamThrough
} from '../types'

import {
  assign,
  noop
} from 'lodash'

import tape = require('tape')

function hang<P, E>(values: P[], onAbort?: () => void): StreamSource<P, E> {
  let i = 0
  let _cb: StreamCallback<P, E>

  return (abort, cb) => {
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

interface LocalStreamThrough<P, R, E = Error> {
  (source: StreamSource<P, E>): (abort: StreamAbort<E>, cb: StreamCallback<R, E>) => void
  abort?: StreamSinkAbort<P, E>
}

function abortable<P, E>(): LocalStreamThrough<P, P, E> {
  let _read: StreamSource<P, E>
  let aborted: StreamAbort<E>

  const reader: LocalStreamThrough<P, P, E> = read => {
      _read = read

      return (abort: StreamAbort<E>, cb: StreamCallback<P, E>) => {
        if (abort) aborted = abort
        read(abort, cb)
      }
  }

  reader.abort = (_, cb) => {
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
      _read(true, cb)
    }
  }

  return reader
}

function test <E>(name: string, trx: StreamThrough<number, E>) {
  tape(`test abort: + ${name}`, t => {
    const a = abortable()
    const s: StreamSource<number, E> = hang([1, 2, 3], () => {
        t.end()
      })

    pull(
      s,
      trx,
      a,
      drain(e => {
        if (e === 3) {
          setImmediate(() => {
            a.abort()
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
