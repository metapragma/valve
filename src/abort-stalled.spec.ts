/* tslint:disable no-increment-decrement */

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

// tslint:disable-next-line
import immediate = require('immediate')

import { map, take, through, valve } from './index'

import { isFunction, noop } from 'lodash'

import { createSink, hasEnded } from './utilities'

import {
  ValveActionAbort,
  ValveActionError,
  ValveActionType,
  ValveSource,
  ValveSourceCallback,
  ValveThrough,
  ValveType
} from './types'

function hang<P, E>(values: P[], onAbort?: () => void): ValveSource<P, E> {
  let i = 0
  let _cb: ValveSourceCallback<P, E>

  return {
    type: ValveType.Source,
    source(action, cb) {
      if (i < values.length) {
        cb({ type: ValveActionType.Data, payload: values[i++] })
      } else if (!hasEnded(action)) {
        _cb = cb
      } else {
        _cb(action)
        cb(action)
        // tslint:disable-next-line no-unused-expression
        if (isFunction(onAbort)) {
          onAbort()
        }
      }
    }
  }
}

function abortable<P, E>(): ValveThrough<P, P, E> {
  let _read: ValveSource<P, E>
  let ended: ValveActionError<E> | ValveActionAbort

  return {
    type: ValveType.Through,
    terminate: () => {
      if (!hasEnded(ended)) {
        _read.source({ type: ValveActionType.Abort }, noop)
      }
    },
    sink(read) {
      _read = read

      return {
        type: ValveType.Source,
        source(action, cb) {
          if (hasEnded(action)) {
            ended = action
          }

          read.source(action, cb)
        }
      }
    }
  }
}

function test<E>(
  trx: ValveThrough<number, number, E>,
  done: (err?: {}) => void
) {
  const source = (): ValveSource<number, E> =>
    hang([1, 2, 3], () => {
      done()
    })

  const abortableThrough = abortable<number, E>()

  const sink = createSink<number, E>({
    onData(action) {
      if (action.payload === 3) {
        immediate(() => {
          abortableThrough.terminate()
        })
      }
    },
    onAbort(action) {
      assert.equal(action.type, ValveActionType.Abort)
    }
  })

  valve(source(), trx, abortableThrough, sink)
}

describe('abort-stalled', () => {
  it('through', done => {
    test(through(), done)
  })

  it('map', done => {
    test(map(e => e), done)
  })

  it('take', done => {
    test(take(() => true), done)
  })
})
