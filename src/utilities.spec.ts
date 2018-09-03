/* tslint:disable strict-boolean-expressions no-shadowed-variable no-increment-decrement */

import { assert } from 'chai'
import {
  Sink,
  Source,
  Through,
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

import { isFunction, isNumber, noop } from 'lodash'
import { spy as sinonSpy } from 'sinon'
import { hasEnded } from './internal/hasEnded'

import {
  ValveCallback,
  ValveMessageType,
  ValveSource,
  ValveSourceFactory,
  ValveSourceMessage,
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
): ValveSourceFactory<P, E> {
  let i = 0
  let _cb: ValveCallback<P, E, ValveSourceMessage>

  return {
    pipe() {
      return cb => (message, value) => {
        if (i < values.length) {
          cb(ValveMessageType.Next, values[i++])
        } else if (!hasEnded(message)) {
          _cb = cb
        } else {
          _cb(message, value)
          cb(message, value)
          // tslint:disable-next-line no-unused-expression
          if (isFunction(complete)) {
            complete()
          }
        }
      }
    },
    type: ValveType.Source
  }
}

function completeable<P, E>(): ValveThroughFactory<P, P, E> & {
  terminate: () => void
} {
  let _read: ValveSource<P, E>
  let ended: ValveMessageType.Error | ValveMessageType.Complete
  // let endedValue: E | undefined

  return {
    pipe() {
      return read => {
        _read = read

        return cb => (message, value) => {
          if (hasEnded(message)) {
            ended = message

            // TODO: wah?
            // endedValue = value
          }

          read(cb)(message, value)
        }
      }
    },
    terminate() {
      if (!hasEnded(ended)) {
        _read(noop)(ValveMessageType.Complete, undefined)
      }
    },
    type: ValveType.Through
  }
}

function test<E>(
  trx: ValveThroughFactory<number, number, E>,
  done: (err?: {}) => void
) {
  const source = (): ValveSourceFactory<number, E> =>
    hang([1, 2, 3], () => {
      done()
    })

  const completeableThrough = completeable<number, E>()

  const sink = Sink.create<number, {}, E>(() => ({
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
    assert.equal(hasEnded(ValveMessageType.Complete), true)
    assert.equal(hasEnded(ValveMessageType.Error), true)
    assert.equal(hasEnded(ValveMessageType.Pull), false)
    assert.equal(hasEnded(ValveMessageType.Next), false)
    assert.equal(hasEnded(undefined), false)
  })
})

describe('Source', () => {
  it('defaults', done => {
    const source = Source.create()

    assert(isFunction(Source))
    assert(isFunction(source.pipe))
    assert.equal(source.type, ValveType.Source)

    const instance = source.pipe()

    assert(isFunction(instance))

    const cb = instance(message => {
      assert(isNumber(message))
      assert.equal(message, ValveMessageType.Complete)

      done()
    })

    cb(ValveMessageType.Pull, undefined)
  })

  it('Source pull', () => {
    const spyOne = sinonSpy()
    const spyTwo = sinonSpy()

    const source = Source.create<string>(({ complete, next, error, noop }) => ({
      pull() {
        spyOne()
        assert(isFunction(complete))
        assert(isFunction(next))
        assert(isFunction(error))
        assert(isFunction(noop))
        next('next')
      }
    }))

    assert.equal(source.type, ValveType.Source)

    const instance = source.pipe()((message, value) => {
      spyTwo(message, value)
    })

    instance(ValveMessageType.Pull, undefined)
    instance(ValveMessageType.Pull, undefined)

    assert.equal(spyTwo.callCount, 2)
    assert.equal(spyOne.callCount, 2)
    assert.ok(spyTwo.firstCall.calledWith(ValveMessageType.Next, 'next'))
    assert.ok(spyTwo.secondCall.calledWith(ValveMessageType.Next, 'next'))
  })

  it('Source complete', () => {
    const spyOne = sinonSpy()
    const spyTwo = sinonSpy()

    const source = Source.create<string>(({ complete, next }) => ({
      pull() {
        spyOne()
        assert(isFunction(next))
        next('next')
      },
      complete() {
        spyOne()
        assert(isFunction(complete))
        complete()
      }
    }))

    assert.equal(source.type, ValveType.Source)

    const instance = source.pipe()((message, value) => {
      spyTwo(message, value)
    })

    instance(ValveMessageType.Pull, undefined)
    instance(ValveMessageType.Complete, undefined)

    assert.equal(spyOne.callCount, 2)
    assert.equal(spyTwo.callCount, 2)
    assert.ok(spyTwo.firstCall.calledWith(ValveMessageType.Next, 'next'))
    assert.ok(
      spyTwo.secondCall.calledWith(ValveMessageType.Complete, undefined)
    )
  })

  it('Source error', () => {
    const spyOne = sinonSpy()
    const spyTwo = sinonSpy()

    const ERR = new Error('Error')

    const source = Source.create<string, typeof ERR>(({ next, error }) => ({
      pull() {
        spyOne()
        next('next')
      },
      error(err) {
        spyOne()
        assert.equal(err, ERR)
        error(err)
      }
    }))

    assert.equal(source.type, ValveType.Source)

    const instance = source.pipe()((message, value) => {
      spyTwo(message, value)
    })

    instance(ValveMessageType.Pull, undefined)
    instance(ValveMessageType.Error, ERR)

    assert.equal(spyOne.callCount, 2)
    assert.equal(spyTwo.callCount, 2)
    assert.ok(spyTwo.firstCall.calledWith(ValveMessageType.Next, 'next'))
    assert.ok(spyTwo.secondCall.calledWith(ValveMessageType.Error, ERR))
  })
})

describe('Sink', () => {
  it('...', done => {
    const spy = sinonSpy()

    const drain = Sink.create(({ complete, error }) => ({
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

    assert(isFunction(drain.pipe))
    assert.equal(drain.type, ValveType.Sink)

    const instance = drain.pipe()
    assert(isFunction(instance))

    valve()(fromIterable([1, 2, 3, 4]), drain).schedule()
  })

  it('Sink complete', done => {
    const spy = sinonSpy()
    let c = 100

    const drain = Sink.create((_, { complete }) => ({
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

  it('Sink error', done => {
    const spy = sinonSpy()
    const ERR = new Error('Error')
    let c = 100

    const drain = Sink.create((_, { error }) => ({
      next(value) {
        spy()

        assert(isNumber(value))
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

  it('delayed Sink complete', done => {
    const spy = sinonSpy()
    let c = 100

    const drain = Sink.create((_, { complete }) => ({
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

  it('delayed Sink error', done => {
    const spy = sinonSpy()
    const ERR = new Error('Error')
    let c = 100

    valve()(
      infinite(),
      delay(),
      Sink.create((_, { error }) => ({
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

  // it('Sink instant complete', done => {
  //   const spy = sinonSpy()
  //
  //   const drain = Sink(() => ({
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
  // it('Sink instant error', done => {
  //   const spy = sinonSpy()
  //   const err = new Error('Error')
  //
  //   const drain = Sink({
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

  it('Sink empty source', done => {
    const spy = sinonSpy()

    const drain = Sink.create(() => ({
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

  it('Sink source error', done => {
    const spy = sinonSpy()
    const ERR = new Error('Error')

    valve<typeof ERR>()(
      error(ERR),
      Sink.create(() => ({
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

  it('Sink deaults', () => {
    const drain = Sink.create()

    valve()(empty(), drain).schedule()
  })
})

describe('Source', () => {
  it('...', done => {
    // const spy = sinonSpy()

    const stream = valve()(count(5), Through.create(), collect())

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
      Through.create(({ next, complete }) => ({
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
      Through.create(({ next, error }) => ({
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
      Through.create(
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
      Through.create(
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
    test(Through.create(), done)
  })

  it('map', done => {
    test(map(e => e), done)
  })

  it('take', done => {
    test(take(() => true), done)
  })
})
