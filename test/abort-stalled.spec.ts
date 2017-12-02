/* tslint:disable no-increment-decrement */

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'
import { spy } from 'sinon'

// tslint:disable-next-line
import immediate = require('immediate')

import {
  drain,
  map,
  pull,
  take,
  through
} from '../index'

import {
  ValveSource,
  ValveThrough,
  ValveSinkFunction,
  ValveAbortFunction,
  ValveSourceFunction,
  ValveThroughFunction,
  ValveAbort,
  ValveCallback,
  ValveType
} from '../types'

import {
  assign,
  noop
} from 'lodash'

function hang<P, E>(values: P[], onAbort?: () => void): ValveSource<P, E> {
  let i = 0
  let _cb: ValveCallback<P, E>

  return {
    type: ValveType.Source,
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
//   (source: StreamSource<P, E>): (abort: ValveAbort<E>, cb: ValveCallback<R, E>) => void
//   abort?: StreamSinkAbort<P, E>
// }

function abortable<P, E>(): ValveThrough<P, P, E> {
  let _read: ValveSource<P, E>
  let aborted: ValveAbort<E>

  const reader: ValveThrough<P, P, E> = {
    type: ValveType.Through,
    sink (read) {
      _read = read

      return {
        type: ValveType.Source,
        source (abort: ValveAbort<E>, cb: ValveCallback<P, E>) {
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

function test <E>(trx: ValveThrough<number, number, E>, done: (err?: any) => void) {
    const a = abortable()

    const s = (): ValveSource<number, E> => hang([1, 2, 3], () => {
      done()
    })

    pull(
      s(),
      trx,
      a,
      drain(e => {
        if (e === 3) {
          immediate(() => {
            a.sink.abort()
          })
        }
      },
        err => {
          expect(err).to.equal(null)
        }
      )
    )
}

describe('test/abort-stalled', () => {
  it('through', done => {
    test(through(e => e), done)
  })

  it('map', done => {
    test(map(e => e), done)
  })

  it('take', done => {
    test(take(e => e), done)
  })
})
