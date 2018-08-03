/* tslint:disable no-import-side-effect strict-boolean-expressions no-shadowed-variable no-increment-decrement */

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
  map,
  take,
  valve
} from './index'

import { createSink, createSource, createThrough, hasEnded } from './utilities'
import { assign, isFunction, isNumber, isPlainObject, noop } from 'lodash'
import { spy as sinonSpy } from 'sinon'

import {
  ValveActionAbort,
  ValveActionError,
  ValveActionType,
  ValveCallback,
  ValveSource,
  ValveSourceFactory,
  ValveThrough,
  ValveThroughFactory,
  ValveType
} from './types'

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

function hang<P, E>(values: P[], onAbort?: () => void): ValveSourceFactory<P, E> {
  let i = 0
  let _cb: ValveCallback<P, E>

  return assign<() => ValveSource<P, E>, { type: ValveType.Source }>(
    () => (action, cb) => {
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
    },
    { type: ValveType.Source }
  )
}

function abortable<P, E>(): ValveThroughFactory<P, P, E> & { terminate: () => void } {
  let _read: ValveSource<P, E>
  let ended: ValveActionError<E> | ValveActionAbort

  return assign<
    () => ValveThrough<P, P, E>,
    { type: ValveType.Through },
    { terminate: () => void }
  >(
    () => {
      return read => {
        _read = read

        return (action, cb) => {
          if (hasEnded(action)) {
            ended = action
          }

          read(action, cb)
        }
      }
    },
    { type: ValveType.Through },
    {
      terminate() {
        if (!hasEnded(ended)) {
          _read({ type: ValveActionType.Abort }, noop)
        }
      }
    }
  )
}

function test<E>(trx: ValveThroughFactory<number, number, E>, done: (err?: {}) => void) {
  const source = (): ValveSourceFactory<number, E> =>
    hang([1, 2, 3], () => {
      done()
    })

  const abortableThrough = abortable<number, E>()

  const sink = createSink<number, E>(() => ({
    onData(data) {
      if (data === 3) {
        setImmediate(() => {
          abortableThrough.terminate()
        })
      }
    }
  }))

  valve(source(), trx, abortableThrough, sink)
}

describe('utilities', () => {
  it('hasEnded', () => {
    assert.equal(hasEnded({ type: ValveActionType.Abort }), true)
    assert.equal(hasEnded({ type: ValveActionType.Error, payload: {} }), true)
    assert.equal(hasEnded({ type: ValveActionType.Pull }), false)
    assert.equal(hasEnded({ type: ValveActionType.Data, payload: {} }), false)
    assert.equal(hasEnded(undefined), false)
  })
})

describe('createSource', () => {
  it('defaults', done => {
    const source = createSource()

    assert(isFunction(createSource))
    assert(isFunction(source))
    assert.equal(source.type, ValveType.Source)

    source()({ type: ValveActionType.Pull }, action => {
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

    const source = createSource<string>(({ abort, data, error, noop }) => ({
      onPull() {
        spy()
        assert(isFunction(abort))
        assert(isFunction(data))
        assert(isFunction(error))
        assert(isFunction(noop))
        data('data')
      }
    }))

    assert(isFunction(source))
    assert.equal(source.type, ValveType.Source)

    const instance = source()

    assert(isFunction(instance))

    instance({ type: ValveActionType.Pull }, action => {
      assert(isPlainObject(action))

      if (action.type === ValveActionType.Data) {
        assert.equal(action.payload, 'data')
        assert.equal(spy.callCount, 1)
      } else {
        done(new Error('Action type mismatch'))
      }

      instance({ type: ValveActionType.Pull }, _action => {
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

    const source = createSource<string>(({ abort }) => ({
      onAbort() {
        spy()
        assert(isFunction(abort))
        abort()
      }
    }))

    assert(isFunction(source))
    assert.equal(source.type, ValveType.Source)

    const instance = source()

    assert(isFunction(instance))

    instance({ type: ValveActionType.Pull }, action => {
      assert(isPlainObject(action))
      assert.equal(action.type, ValveActionType.Abort)

      instance({ type: ValveActionType.Abort }, _action => {
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
    const ERR = new Error('Error')

    const source = createSource<string>(({ error }) => ({
      onError(err) {
        spy()
        assert.equal(err, ERR)
        error(err)
      }
    }))

    assert(isFunction(source))
    assert.equal(source.type, ValveType.Source)

    const instance = source()

    assert(isFunction(instance))

    instance({ type: ValveActionType.Pull }, action => {
      assert(isPlainObject(action))
      assert.equal(action.type, ValveActionType.Abort)

      instance({ type: ValveActionType.Error, payload: ERR }, _action => {
        assert(isPlainObject(action))

        if (_action.type === ValveActionType.Error) {
          assert.equal(_action.payload, ERR)
          assert.equal(spy.callCount, 1)
          done()
        } else {
          done(new Error('Action type mismatch'))
        }
      })
    })
  })
})

describe('createSink', () => {
  it('...', done => {
    const spy = sinonSpy()

    const drain = createSink(({ abort, error }) => ({
      onData(data) {
        spy()
        assert(isNumber(data))
      },
      onAbort() {
        assert.equal(spy.callCount, 4)
        assert(isFunction(error))
        assert(isFunction(abort))
        done()
      }
    }))

    assert(isFunction(drain))
    assert.equal(drain.type, ValveType.Sink)

    const instance = drain()
    assert(isFunction(instance))

    valve(fromIterable([1, 2, 3, 4]), drain)
  })

  it('createSink abort', done => {
    const spy = sinonSpy()
    let c = 100

    const drain = createSink(({ abort }) => ({
      onData(data) {
        spy()

        assert(isNumber(data))
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) abort()
      },
      onAbort() {
        assert.equal(spy.callCount, 100)
        done()
      }
    }))

    valve(infinite(), drain)
  })

  it('createSink error', done => {
    const spy = sinonSpy()
    const ERR = new Error('Error')
    let c = 100

    const drain = createSink(({ error }) => ({
      onData(data) {
        spy()

        assert(isNumber(data))
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) error(ERR)
      },
      onError(err) {
        assert.equal(err, ERR)
        assert.equal(spy.callCount, 100)
        done()
      }
    }))

    valve(infinite(), drain)
  })

  it('createSink abort', done => {
    const spy = sinonSpy()
    let c = 100

    const drain = createSink(({ abort }) => ({
      onData(data) {
        spy()

        assert(isNumber(data))
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) abort()
      },
      onAbort() {
        assert.equal(spy.callCount, 100)
        done()
      }
    }))

    valve(infinite(), delay(), drain)
  })

  it('delayed createSink error', done => {
    const spy = sinonSpy()
    const ERR = new Error('Error')
    let c = 100

    const drain = createSink(({ error }) => ({
      onData(data) {
        spy()

        assert(isNumber(data))
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) error(ERR)
      },
      onError(err) {
        assert.equal(err, ERR)
        assert.equal(spy.callCount, 100)

        done()
      }
    }))

    valve(infinite(), delay(), drain)
  })

  // it('createSink instant abort', done => {
  //   const spy = sinonSpy()
  //
  //   const drain = createSink(() => ({
  //     onData() {
  //       spy()
  //     },
  //     onAbort() {
  //       assert.equal(spy.callCount, 0)
  //       done()
  //     }
  //   }))
  //
  //   drain.terminate({ type: ValveActionType.Abort })
  //
  //   valve(infinite(), drain)
  // })
  //
  // it('createSink instant error', done => {
  //   const spy = sinonSpy()
  //   const err = new Error('Error')
  //
  //   const drain = createSink({
  //     onData() {
  //       spy()
  //     },
  //     onError(action) {
  //       assert.equal(action.type, ValveActionType.Error)
  //       assert.equal(action.payload, err)
  //       assert.equal(spy.callCount, 0)
  //       done()
  //     }
  //   })
  //
  //   drain.terminate({ type: ValveActionType.Error, payload: err })
  //
  //   valve(infinite(), drain)
  // })

  it('createSink empty source', done => {
    const spy = sinonSpy()

    const drain = createSink(() => ({
      onData() {
        spy()
      },
      onAbort() {
        assert.equal(spy.callCount, 0)
        done()
      }
    }))

    valve(empty(), drain)
  })

  it('createSink source error', done => {
    const spy = sinonSpy()
    const ERR = new Error('Error')

    const drain = createSink(() => ({
      onData() {
        spy()
      },
      onError(err) {
        assert.equal(err, ERR)
        assert.equal(spy.callCount, 0)
        done()
      }
    }))

    valve(error(ERR), drain)
  })

  it('createSink deaults', () => {
    const drain = createSink()

    valve(empty(), drain)
  })
})

describe('createSource', () => {
  it('...', done => {
    // const spy = sinonSpy()

    valve(
      count(5),
      createThrough(),
      collect({
        onData(data) {
          assert.deepEqual(data, [1, 2, 3, 4, 5])
          done()
        }
      })
    )
  })

  it('source onData', done => {
    const spy = sinonSpy()
    const spyTwo = sinonSpy()

    valve(
      count(5),
      createThrough(({ data, abort }) => ({
        onData(n) {
          spy()
          assert(isNumber(n))
          assert(isFunction(data))

          data(n)
        },
        onAbort() {
          spyTwo()
          assert(isFunction(abort))

          abort()
        }
      })),
      collect({
        onData(payload) {
          assert.deepEqual(payload, [1, 2, 3, 4, 5])
          assert.equal(spy.callCount, 5)
          assert.equal(spyTwo.callCount, 1)
          done()
        }
      })
    )
  })

  it('source onError', done => {
    const spy = sinonSpy()
    const spyTwo = sinonSpy()
    const ERR = new Error('err')

    valve(
      error(ERR),
      createThrough(({ data, error }) => ({
        onData(n) {
          spy()
          assert(isFunction(data))

          data(n)
        },
        onError(err) {
          spyTwo()
          assert.equal(err, ERR)
          assert(isFunction(error))

          error(err)
        }
      })),
      collect({
        onError(err) {
          assert.equal(err, ERR)
          assert.equal(spy.callCount, 0)
          assert.equal(spyTwo.callCount, 1)
          done()
        }
      })
    )
  })

  it('sink onPull/onData', done => {
    const spyPull = sinonSpy()
    const spyData = sinonSpy()
    const spySourceAbort = sinonSpy()
    const spySinkAbort = sinonSpy()

    valve(
      count(5),
      createThrough(
        ({ data, abort }) => ({
          onData(n) {
            spyData()
            assert(isNumber(n))
            assert(isFunction(data))

            data(n)
          },
          onAbort() {
            spySourceAbort()
            assert(isFunction(abort))

            abort()
          }
        }),
        ({ pull, abort }) => ({
          onPull() {
            spyPull()
            pull()
          },
          onAbort() {
            spySinkAbort()
            abort()
          }
        })
      ),
      collect({
        onData(data) {
          assert.deepEqual(data, [1, 2, 3, 4, 5])
          assert.equal(spyPull.callCount, 6)
          assert.equal(spyData.callCount, 5)
          assert.equal(spySourceAbort.callCount, 1)
          assert.equal(spySinkAbort.callCount, 0)
          done()
        }
      })
    )
  })

  it('sink onPull/onError', done => {
    const spyPull = sinonSpy()
    const spyData = sinonSpy()
    const spySourceError = sinonSpy()
    const spySinkError = sinonSpy()
    const ERR = new Error('err')

    valve(
      error(ERR),
      createThrough(
        ({ data, error }) => ({
          onData(n) {
            spyData()
            assert(isNumber(n))
            assert(isFunction(data))

            data(n)
          },
          onError(err) {
            spySourceError()
            assert(isFunction(error))
            assert.deepEqual(err, ERR)

            error(err)
          }
        }),
        ({ pull, error }) => ({
          onPull() {
            spyPull()
            pull()
          },
          onError(err) {
            spySinkError()
            error(err)
          }
        })
      ),
      collect({
        onError(err) {
          assert.deepEqual(err, ERR)
          assert.equal(spyPull.callCount, 1)
          assert.equal(spyData.callCount, 0)
          assert.equal(spySourceError.callCount, 1)
          assert.equal(spySinkError.callCount, 0)

          done()
        }
      })
    )
  })
})

describe('abort-stalled', () => {
  it('through', done => {
    test(createThrough(), done)
  })

  it('map', done => {
    test(map(e => e), done)
  })

  it('take', done => {
    test(take(() => true), done)
  })
})
