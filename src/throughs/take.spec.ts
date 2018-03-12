import {
  collect,
  empty,
  error,
  fromIterable,
  take,
  through,
  valve
} from '../index'

import { ValveActionType, ValveError, ValveThrough, ValveType } from '../types'

import { spy as sinonSpy } from 'sinon'

import { hasEnded } from '../utilities'

// tslint:disable-next-line
import immediate = require('immediate')

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('throughs/take', () => {
  it('...', done => {
    const data = [1]

    valve(
      fromIterable(data),
      take(0),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [])
          done()
        }
      })
    )
  })

  it('...', done => {
    const data = [1, 2, undefined, 4, 5, 6, 7, 8, 9, 10]

    valve(
      fromIterable(data),
      take(5),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, undefined, 4, 5])
          done()
        }
      })
    )
  })

  it('...', done => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    valve(
      fromIterable(data),
      take(5),
      through({
        onAbort() {
          immediate(() => {
            done()
          })
        }
      }),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3, 4, 5])
        }
      })
    )
  })

  it('error', done => {
    const err = new Error()

    valve(
      error(err),
      take(0),
      collect({
        onError(action) {
          assert.deepEqual(action.payload, err)
          done()
        }
      })
    )
  })

  it('empty', done => {
    valve(
      empty(),
      take(0),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [])
          done()
        }
      })
    )
  })

  it('exclude last', done => {
    valve(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      take(n => {
        return n < 5
      }),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3, 4])
          done()
        }
      })
    )
  })

  it('include last', done => {
    valve(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      take(n => {
        return n < 5
      }, true),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3, 4, 5])
          done()
        }
      })
    )
  })

  it('upstream', done => {
    const pulls = sinonSpy()
    const pushes = sinonSpy()

    const thr = <P, E = ValveError>(): ValveThrough<P, P, E> => ({
      type: ValveType.Through,
      sink(source) {
        return {
          type: ValveType.Source,
          source(action, cb) {
            // tslint:disable-next-line no-increment-decrement
            if (action.type === ValveActionType.Pull) pulls()
            source.source(action, _action => {
              if (_action.type === ValveActionType.Data) pushes()
              cb(_action)
            })
          }
        }
      }
    })

    valve(
      fromIterable([1, 2, 3, 4, 5, 5, 7, 5, 9, 10]),
      thr(),
      take(5),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3, 4, 5])
          immediate(() => {
            assert.equal(pulls.callCount, 5)
            assert.equal(pushes.callCount, 5)
            done()
          })
        }
      })
    )
  })

  it('abort', done => {
    const ary = [1, 2, 3, 4, 5]
    let ended = false
    let i = 0

    const read = valve(
      {
        type: ValveType.Source,
        source(action, cb) {
          if (hasEnded(action)) {
            ended = true
            cb(action)
          } else if (i > ary.length) {
            cb({ type: ValveActionType.Abort })
          } else {
            cb({
              type: ValveActionType.Data,
              // tslint:disable-next-line no-increment-decrement
              payload: ary[i++]
            })
          }
        }
      },
      take(d => {
        return d < 3
      }, true)
    )

    read.source({ type: ValveActionType.Pull }, () => {
      assert.notOk(ended)
      read.source({ type: ValveActionType.Pull }, () => {
        assert.notOk(ended)
        read.source({ type: ValveActionType.Pull }, () => {
          assert.notOk(ended)
          read.source({ type: ValveActionType.Pull }, action => {
            assert.equal(action.type, ValveActionType.Abort)
            assert.isOk(ended)
            done()
          })
        })
      })
    })
  })
})
