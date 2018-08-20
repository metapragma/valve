/* tslint:disable no-import-side-effect strict-boolean-expressions no-shadowed-variable no-increment-decrement */

import 'mocha'
import { assert } from 'chai'
import {
  asyncMap,
  collect,
  count,
  createSink,
  createSource,
  createThrough,
  empty,
  error,
  fromIterable,
  infinite,
  map,
  take,
  valve
} from './index'

import { assign, isFunction, isNumber, isPlainObject, noop } from 'lodash'
import { spy as sinonSpy } from 'sinon'
import { hasEnded } from './internal/hasEnded'

import {
  ValveCallback,
  ValveMessageComplete,
  ValveMessageError,
  ValveMessageType,
  ValveSource,
  ValveSourceFactory,
  ValveThrough,
  ValveThroughFactory,
  ValveType
} from './types'

function delay<A, C>() {
  return asyncMap<A, A, C>(
    e =>
      new Promise<A>(resolve => {
        setTimeout(() => {
          resolve(e)
        }, 1)
      })
  )
}

function hang<P, E>(
  values: P[],
  complete?: () => void
): ValveSourceFactory<P, {}, E> {
  let i = 0
  let _cb: ValveCallback<P, E>

  return assign<() => ValveSource<P, E>, { type: ValveType.Source }>(
    () => (action, cb) => {
      if (i < values.length) {
        cb({ type: ValveMessageType.Next, payload: values[i++] })
      } else if (!hasEnded(action)) {
        _cb = cb
      } else {
        _cb(action)
        cb(action)
        // tslint:disable-next-line no-unused-expression
        if (isFunction(complete)) {
          complete()
        }
      }
    },
    { type: ValveType.Source }
  )
}

function completeable<P, E>(): ValveThroughFactory<P, P, {}, E> & {
  terminate: () => void
} {
  let _read: ValveSource<P, E>
  let ended: ValveMessageError<E> | ValveMessageComplete

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
          _read({ type: ValveMessageType.Complete }, noop)
        }
      }
    }
  )
}

function test<E>(
  trx: ValveThroughFactory<number, number, {}, E>,
  done: (err?: {}) => void
) {
  const source = (): ValveSourceFactory<number, {}, E> =>
    hang([1, 2, 3], () => {
      done()
    })

  const completeableThrough = completeable<number, E>()

  const sink = createSink<number, {}, {}, E>(() => ({
    next(next) {
      if (next === 3) {
        setImmediate(() => {
          completeableThrough.terminate()
        })
      }
    }
  }))

  valve<E>()(source(), trx, completeableThrough, sink).schedule()
}

describe('utilities', () => {
  it('hasEnded', () => {
    assert.equal(hasEnded({ type: ValveMessageType.Complete }), true)
    assert.equal(hasEnded({ type: ValveMessageType.Error, payload: {} }), true)
    assert.equal(hasEnded({ type: ValveMessageType.Pull }), false)
    assert.equal(hasEnded({ type: ValveMessageType.Next, payload: {} }), false)
    assert.equal(hasEnded(undefined), false)
  })
})

describe('createSource', () => {
  it('defaults', done => {
    const source = createSource()

    assert(isFunction(createSource))
    assert(isFunction(source))
    assert.equal(source.type, ValveType.Source)

    source()({ type: ValveMessageType.Pull }, action => {
      assert(isPlainObject(action))

      if (action.type === ValveMessageType.Complete) {
        done()
      } else {
        done(new Error('Action type mismatch'))
      }
    })
  })

  it('createSource pull', done => {
    const spy = sinonSpy()

    const source = createSource<string>(({ complete, next, error, noop }) => ({
      pull() {
        spy()
        assert(isFunction(complete))
        assert(isFunction(next))
        assert(isFunction(error))
        assert(isFunction(noop))
        next('next')
      }
    }))

    assert(isFunction(source))
    assert.equal(source.type, ValveType.Source)

    const instance = source()

    assert(isFunction(instance))

    instance({ type: ValveMessageType.Pull }, action => {
      assert(isPlainObject(action))

      if (action.type === ValveMessageType.Next) {
        assert.equal(action.payload, 'next')
        assert.equal(spy.callCount, 1)
      } else {
        done(new Error('Action type mismatch'))
      }

      instance({ type: ValveMessageType.Pull }, _action => {
        assert(isPlainObject(_action))

        if (_action.type === ValveMessageType.Next) {
          assert.equal(_action.payload, 'next')
          assert.equal(spy.callCount, 2)
          done()
        } else {
          done(new Error('Action type mismatch'))
        }
      })
    })
  })

  it('createSource complete', done => {
    const spy = sinonSpy()

    const source = createSource<string>(({ complete }) => ({
      complete() {
        spy()
        assert(isFunction(complete))
        complete()
      }
    }))

    assert(isFunction(source))
    assert.equal(source.type, ValveType.Source)

    const instance = source()

    assert(isFunction(instance))

    instance({ type: ValveMessageType.Pull }, action => {
      assert(isPlainObject(action))
      assert.equal(action.type, ValveMessageType.Complete)

      instance({ type: ValveMessageType.Complete }, _action => {
        assert(isPlainObject(action))

        if (_action.type === ValveMessageType.Complete) {
          assert.equal(spy.callCount, 1)
          done()
        } else {
          done(new Error('Action type mismatch'))
        }
      })
    })
  })

  it('createSource error', done => {
    const spy = sinonSpy()
    const ERR = new Error('Error')

    const source = createSource<string, {}, typeof ERR>(({ error }) => ({
      error(err) {
        spy()
        assert.equal(err, ERR)
        error(err)
      }
    }))

    assert(isFunction(source))
    assert.equal(source.type, ValveType.Source)

    const instance = source()

    assert(isFunction(instance))

    instance({ type: ValveMessageType.Pull }, action => {
      assert(isPlainObject(action))
      assert.equal(action.type, ValveMessageType.Complete)

      instance({ type: ValveMessageType.Error, payload: ERR }, _action => {
        assert(isPlainObject(action))

        if (_action.type === ValveMessageType.Error) {
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

    const drain = createSink(({ complete, error }) => ({
      next(next) {
        spy()
        assert(isNumber(next))
      },
      complete() {
        assert.equal(spy.callCount, 4)
        assert(isFunction(error))
        assert(isFunction(complete))
        done()
      }
    }))

    assert(isFunction(drain))
    assert.equal(drain.type, ValveType.Sink)

    const instance = drain()
    assert(isFunction(instance))

    valve()(fromIterable([1, 2, 3, 4]), drain).schedule()
  })

  it('createSink complete', done => {
    const spy = sinonSpy()
    let c = 100

    const drain = createSink(({ complete }) => ({
      next(next) {
        spy()

        assert(isNumber(next))
        if (c < 0) throw new Error('stream should have completeed')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) complete()
      },
      complete() {
        assert.equal(spy.callCount, 100)
        done()
      }
    }))

    valve()(infinite(), drain).schedule()
  })

  it('createSink error', done => {
    const spy = sinonSpy()
    const ERR = new Error('Error')
    let c = 100

    const drain = createSink(({ error }) => ({
      next(next) {
        spy()

        assert(isNumber(next))
        if (c < 0) throw new Error('stream should have completeed')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) error(ERR)
      },
      error(err) {
        assert.equal(err, ERR)
        assert.equal(spy.callCount, 100)
        done()
      }
    }))

    valve()(infinite(), drain).schedule()
  })

  it('delayed createSink complete', done => {
    const spy = sinonSpy()
    let c = 100

    const drain = createSink(({ complete }) => ({
      next(next) {
        spy()

        assert(isNumber(next))
        if (c < 0) throw new Error('stream should have completeed')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) complete()
      },
      complete() {
        assert.equal(spy.callCount, 100)
        done()
      }
    }))

    valve()(infinite(), delay(), drain).schedule()
  })

  it('delayed createSink error', done => {
    const spy = sinonSpy()
    const ERR = new Error('Error')
    let c = 100

    valve()(
      infinite(),
      delay(),
      createSink(({ error }) => ({
        next(next) {
          spy()

          assert(isNumber(next))
          if (c < 0) throw new Error('stream should have completeed')
          // tslint:disable-next-line no-increment-decrement
          if (!--c) error(ERR)
        },
        error(err) {
          assert.equal(err, ERR)
          assert.equal(spy.callCount, 100)

          done()
        }
      }))
    ).schedule()
  })

  // it('createSink instant complete', done => {
  //   const spy = sinonSpy()
  //
  //   const drain = createSink(() => ({
  //     next() {
  //       spy()
  //     },
  //     complete() {
  //       assert.equal(spy.callCount, 0)
  //       done()
  //     }
  //   }))
  //
  //   drain.terminate({ type: ValveMessageType.Complete })
  //
  //   valve(infinite(), drain)
  // })
  //
  // it('createSink instant error', done => {
  //   const spy = sinonSpy()
  //   const err = new Error('Error')
  //
  //   const drain = createSink({
  //     next() {
  //       spy()
  //     },
  //     error(action) {
  //       assert.equal(action.type, ValveMessageType.Error)
  //       assert.equal(action.payload, err)
  //       assert.equal(spy.callCount, 0)
  //       done()
  //     }
  //   })
  //
  //   drain.terminate({ type: ValveMessageType.Error, payload: err })
  //
  //   valve(infinite(), drain)
  // })

  it('createSink empty source', done => {
    const spy = sinonSpy()

    const drain = createSink(() => ({
      next() {
        spy()
      },
      complete() {
        assert.equal(spy.callCount, 0)
        done()
      }
    }))

    valve()(empty(), drain).schedule()
  })

  it('createSink source error', done => {
    const spy = sinonSpy()
    const ERR = new Error('Error')

    valve<typeof ERR>()(
      error(ERR),
      createSink(() => ({
        next() {
          spy()
        },
        error(err) {
          assert.equal(err, ERR)
          assert.equal(spy.callCount, 0)
          done()
        }
      }))
    ).schedule()
  })

  it('createSink deaults', () => {
    const drain = createSink()

    valve()(empty(), drain).schedule()
  })
})

describe('createSource', () => {
  it('...', done => {
    // const spy = sinonSpy()

    const stream = valve()(count(5), createThrough(), collect())

    stream.subscribe({
      next(next) {
        assert.deepEqual(next, [1, 2, 3, 4, 5])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('source next', done => {
    const spy = sinonSpy()
    const spyTwo = sinonSpy()

    const stream = valve()(
      count(5),
      createThrough(({ next, complete }) => ({
        next(n) {
          spy()
          assert(isNumber(n))
          assert(isFunction(next))

          next(n)
        },
        complete() {
          spyTwo()
          assert(isFunction(complete))

          complete()
        }
      })),
      collect()
    )

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [1, 2, 3, 4, 5])
      },
      complete() {
        assert.equal(spy.callCount, 5)
        assert.equal(spyTwo.callCount, 1)
        done()
      }
    })

    stream.schedule()
  })

  it('source error', done => {
    const spy = sinonSpy()
    const spyTwo = sinonSpy()
    const ERR = new Error('err')

    const stream = valve<typeof ERR>()(
      error(ERR),
      createThrough(({ next, error }) => ({
        next(n) {
          spy()
          assert(isFunction(next))

          next(n)
        },
        error(err) {
          spyTwo()
          assert.equal(err, ERR)
          assert(isFunction(error))

          error(err)
        }
      })),
      collect()
    )

    stream.subscribe({
      error(err) {
        assert.equal(err, ERR)
        assert.equal(spy.callCount, 0)
        assert.equal(spyTwo.callCount, 1)
        done()
      }
    })

    stream.schedule()
  })

  it('sink pull/next', done => {
    const spyPull = sinonSpy()
    const spyData = sinonSpy()
    const spySourceAbort = sinonSpy()
    const spySinkAbort = sinonSpy()

    const stream = valve()(
      count(5),
      createThrough(
        ({ next, complete }) => ({
          next(n) {
            spyData()
            assert(isNumber(n))
            assert(isFunction(next))

            next(n)
          },
          complete() {
            spySourceAbort()
            assert(isFunction(complete))

            complete()
          }
        }),
        ({ pull, complete }) => ({
          pull() {
            spyPull()
            pull()
          },
          complete() {
            spySinkAbort()
            complete()
          }
        })
      ),
      collect()
    )

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [1, 2, 3, 4, 5])
      },
      complete() {
        assert.equal(spyPull.callCount, 6)
        assert.equal(spyData.callCount, 5)
        assert.equal(spySourceAbort.callCount, 1)
        assert.equal(spySinkAbort.callCount, 0)
        done()
      }
    })

    stream.schedule()
  })

  it('sink pull/error', done => {
    const spyPull = sinonSpy()
    const spyData = sinonSpy()
    const spySourceError = sinonSpy()
    const spySinkError = sinonSpy()
    const ERR = new Error('err')

    const stream = valve<typeof ERR>()(
      error(ERR),
      createThrough(
        ({ next, error }) => ({
          next(n) {
            spyData()
            assert(isNumber(n))
            assert(isFunction(next))

            next(n)
          },
          error(err) {
            spySourceError()
            assert(isFunction(error))
            assert.deepEqual(err, ERR)

            error(err)
          }
        }),
        ({ pull, error }) => ({
          pull() {
            spyPull()
            pull()
          },
          error(err) {
            spySinkError()
            error(err)
          }
        })
      ),
      collect()
    )

    stream.subscribe({
      error(err) {
        assert.deepEqual(err, ERR)
        assert.equal(spyPull.callCount, 1)
        assert.equal(spyData.callCount, 0)
        assert.equal(spySourceError.callCount, 1)
        assert.equal(spySinkError.callCount, 0)

        done()
      }
    })

    stream.schedule()
  })
})

describe('complete-stalled', () => {
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
