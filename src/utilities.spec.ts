/* tslint:disable no-import-side-effect strict-boolean-expressions */

import 'mocha'
import { assert } from 'chai'

import {
  asyncMap,
  collect,
  count,
  empty,
  error,
  fromIterable,
  infinite,
  valve
} from './index'

import { createSink, createSource, createThrough, hasEnded } from './utilities'

import { ValveActionType, ValveType } from './types'

import { isFunction, isNumber, isPlainObject } from 'lodash'

import { spy as sinonSpy } from 'sinon'

function delay() {
  return asyncMap(
    e =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(e)
        }, 1)
      })
  )
}

describe('utilities', () => {
  it('hasEnded', () => {
    assert.equal(hasEnded({ type: ValveActionType.Abort }), true)
    assert.equal(hasEnded({ type: ValveActionType.Error, payload: {} }), true)
    assert.equal(hasEnded({ type: ValveActionType.Pull }), false)
    assert.equal(hasEnded({ type: ValveActionType.Data, payload: {} }), false)
    assert.equal(hasEnded(undefined), false)
  })

  it('createSource defaults', done => {
    const source = createSource()

    assert(isFunction(source.source))
    assert.equal(source.type, ValveType.Source)

    source.source({ type: ValveActionType.Pull }, action => {
      assert(isPlainObject(action))

      if (action.type === ValveActionType.Abort) {
        done()
      } else {
        done(new Error('Action type mismatch'))
      }
    })
  })

  it('createSource onPull', done => {
    const spy = sinonSpy()

    const source = createSource<string>({
      onPull(action, cb) {
        spy()
        assert(isFunction(cb))
        assert(isPlainObject(action))
        assert.equal(action.type, ValveActionType.Pull)
        cb({ type: ValveActionType.Data, payload: 'data' })
      }
    })

    assert(isFunction(source.source))
    assert.equal(source.type, ValveType.Source)

    source.source({ type: ValveActionType.Pull }, action => {
      assert(isPlainObject(action))

      if (action.type === ValveActionType.Data) {
        assert.equal(action.payload, 'data')
        assert.equal(spy.callCount, 1)
      } else {
        done(new Error('Action type mismatch'))
      }

      source.source({ type: ValveActionType.Pull }, _action => {
        assert(isPlainObject(_action))

        if (_action.type === ValveActionType.Data) {
          assert.equal(_action.payload, 'data')
          assert.equal(spy.callCount, 2)
          done()
        } else {
          done(new Error('Action type mismatch'))
        }
      })
    })
  })

  it('createSource onAbort', done => {
    const spy = sinonSpy()

    const source = createSource<string>({
      onAbort(action, cb) {
        spy()
        assert(isFunction(cb))
        assert(isPlainObject(action))
        assert.equal(action.type, ValveActionType.Abort)
        cb(action)
      }
    })

    assert(isFunction(source.source))
    assert.equal(source.type, ValveType.Source)

    source.source({ type: ValveActionType.Pull }, action => {
      assert(isPlainObject(action))
      assert.equal(action.type, ValveActionType.Abort)

      source.source({ type: ValveActionType.Abort }, _action => {
        assert(isPlainObject(action))

        if (_action.type === ValveActionType.Abort) {
          assert.equal(spy.callCount, 1)
          done()
        } else {
          done(new Error('Action type mismatch'))
        }
      })
    })
  })

  it('createSource onError', done => {
    const spy = sinonSpy()
    const err = new Error('Error')

    const source = createSource<string>({
      onError(action, cb) {
        spy()
        assert(isFunction(cb))
        assert(isPlainObject(action))
        assert.equal(action.type, ValveActionType.Error)
        cb(action)
      }
    })

    assert(isFunction(source.source))
    assert.equal(source.type, ValveType.Source)

    source.source({ type: ValveActionType.Pull }, action => {
      assert(isPlainObject(action))
      assert.equal(action.type, ValveActionType.Abort)

      source.source({ type: ValveActionType.Error, payload: err }, _action => {
        assert(isPlainObject(action))

        if (_action.type === ValveActionType.Error) {
          assert.equal(_action.payload, err)
          assert.equal(spy.callCount, 1)
          done()
        } else {
          done(new Error('Action type mismatch'))
        }
      })
    })
  })

  it('createSink', done => {
    const spy = sinonSpy()

    const drain = createSink({
      onData(action) {
        spy()
        assert.equal(action.type, ValveActionType.Data)
        assert(isNumber(action.payload))
      },
      onAbort(action) {
        assert.equal(action.type, ValveActionType.Abort)
        assert.equal(spy.callCount, 4)
        done()
      }
    })

    assert(isPlainObject(drain))
    assert(isFunction(drain.sink))
    assert(isFunction(drain.terminate))
    assert.equal(drain.type, ValveType.Sink)

    valve(fromIterable([1, 2, 3, 4]), drain)
  })

  it('createSink abort', done => {
    const spy = sinonSpy()
    let c = 100

    const drain = createSink({
      onData(action) {
        spy()

        assert(isNumber(action.payload))
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) drain.terminate({ type: ValveActionType.Abort })
      },
      onAbort(action) {
        assert.equal(action.type, ValveActionType.Abort)
        assert.equal(spy.callCount, 100)
        done()
      }
    })

    valve(infinite(), drain)
  })

  it('createSink error', done => {
    const spy = sinonSpy()
    const err = new Error('Error')
    let c = 100

    const drain = createSink({
      onData(action) {
        spy()

        assert(isNumber(action.payload))
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) drain.terminate({ type: ValveActionType.Error, payload: err })
      },
      onError(action) {
        assert.equal(action.type, ValveActionType.Error)
        assert.equal(action.payload, err)
        assert.equal(spy.callCount, 100)
        done()
      }
    })

    valve(infinite(), drain)
  })

  it('createSink abort', done => {
    const spy = sinonSpy()
    let c = 100

    const drain = createSink({
      onData(action) {
        spy()

        assert(isNumber(action.payload))
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) drain.terminate({ type: ValveActionType.Abort })
      },
      onAbort(action) {
        assert.equal(action.type, ValveActionType.Abort)
        assert.equal(spy.callCount, 100)
        done()
      }
    })

    valve(infinite(), delay(), drain)
  })

  it('delayed createSink error', done => {
    const spy = sinonSpy()
    const err = new Error('Error')
    let c = 100

    const drain = createSink({
      onData(action) {
        spy()

        assert(isNumber(action.payload))
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) drain.terminate({ type: ValveActionType.Error, payload: err })
      },
      onError(action) {
        assert.equal(action.type, ValveActionType.Error)
        assert.equal(action.payload, err)
        assert.equal(spy.callCount, 100)
        done()
      }
    })

    valve(infinite(), delay(), drain)
  })

  it('createSink instant abort', done => {
    const spy = sinonSpy()

    const drain = createSink({
      onData() {
        spy()
      },
      onAbort(action) {
        assert.equal(action.type, ValveActionType.Abort)
        assert.equal(spy.callCount, 0)
        done()
      }
    })

    drain.terminate({ type: ValveActionType.Abort })

    valve(infinite(), drain)
  })

  it('createSink instant error', done => {
    const spy = sinonSpy()
    const err = new Error('Error')

    const drain = createSink({
      onData() {
        spy()
      },
      onError(action) {
        assert.equal(action.type, ValveActionType.Error)
        assert.equal(action.payload, err)
        assert.equal(spy.callCount, 0)
        done()
      }
    })

    drain.terminate({ type: ValveActionType.Error, payload: err })

    valve(infinite(), drain)
  })

  it('createSink empty source', done => {
    const spy = sinonSpy()

    const drain = createSink({
      onData() {
        spy()
      },
      onAbort(action) {
        assert.equal(action.type, ValveActionType.Abort)
        assert.equal(spy.callCount, 0)
        done()
      }
    })

    valve(empty(), drain)
  })

  it('createSink source error', done => {
    const spy = sinonSpy()
    const err = new Error('Error')

    const drain = createSink({
      onData() {
        spy()
      },
      onError(action) {
        assert.equal(action.type, ValveActionType.Error)
        assert.equal(action.payload, err)
        assert.equal(spy.callCount, 0)
        done()
      }
    })

    valve(error(err), drain)
  })

  it('createSink deaults', () => {
    const drain = createSink()

    valve(empty(), drain)
  })

  it('createThrough defaults', done => {
    // const spy = sinonSpy()

    valve(
      count(5),
      createThrough(),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3, 4, 5])
          done()
        }
      })
    )
  })

  it('createThrough onData', done => {
    const spy = sinonSpy()

    valve(
      count(5),
      createThrough({
        onData(action, cb) {
          spy()
          assert.equal(action.type, ValveActionType.Data)
          assert(isNumber(action.payload))
          assert(isFunction(cb))

          cb(action)
        }
      }),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3, 4, 5])
          assert.equal(spy.callCount, 5)
          done()
        }
      })
    )
  })

  it('createThrough onAbort', done => {
    const spy = sinonSpy()

    valve(
      count(5),
      createThrough({
        onAbort(action) {
          spy()
          assert.equal(action.type, ValveActionType.Abort)
        }
      }),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3, 4, 5])
          assert.equal(spy.callCount, 1)
          done()
        }
      })
    )
  })

  it('createThrough onError', done => {
    const spy = sinonSpy()
    const err = new Error('err')

    valve(
      error(err),
      createThrough({
        onError(action) {
          spy()
          assert.equal(action.type, ValveActionType.Error)
          assert.equal(action.payload, err)
        }
      }),
      collect({
        onError(action) {
          assert.deepEqual(action.payload, err)
          assert.equal(spy.callCount, 1)
          done()
        }
      })
    )
  })
})
