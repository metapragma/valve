import {
  collect,
  concat,
  count,
  createThrough,
  drain,
  empty,
  error,
  find,
  fromIterable,
  reduce,
  valve
} from './index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'
import { spy } from 'sinon'
import { noop } from 'lodash'

describe('sinks/drain', () => {
  it('...', done => {
    const stream = valve()(empty(), drain())

    stream.subscribe({
      next() {
        done()
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('...', done => {
    const stream = valve()(count(3), drain())

    stream.subscribe({
      next(value) {
        assert.isNumber(value)
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('error', done => {
    const ERR = new Error('test')

    const stream = valve<typeof ERR>()(error(ERR), drain())

    stream.subscribe({
      error(err) {
        assert.equal(err, ERR)
        done()
      }
    })

    stream.schedule()
  })
})

describe('sinks/collect', () => {
  it('...', done => {
    const stream = valve()(empty(), collect())

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('...', done => {
    const stream = valve()(count(3), collect())

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [1, 2, 3])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })
})

describe('sinks/concat', () => {
  it('...', done => {
    let n = 0

    const stream = valve()(
      fromIterable('hello there this is a test'.split(/([aeiou])/)),
      createThrough(({ next }) => ({
        next(str) {
          // tslint:disable-next-line no-increment-decrement
          n++

          next(str)
        }
      })),
      concat()
    )

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, 'hello there this is a test')
      },
      complete() {
        assert.equal(n, 17)
        done()
      }
    })

    stream.schedule()
  })
})

describe('sinks/find', () => {
  it('...', done => {
    const stream = valve()(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      find(next => {
        return next === 7
      })
    )

    stream.subscribe({
      next(value) {
        assert.equal(value, 7)
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('random', done => {
    // tslint:disable-next-line insecure-random
    const target = Math.random()
    // tslint:disable-next-line insecure-random
    const f = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(Math.random)

    f.push(target)

    const stream = valve()(
      fromIterable(f.sort()),
      find(next => {
        return next === target
      })
    )

    stream.subscribe({
      next(value) {
        assert.equal(value, target)
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('missing', done => {
    // tslint:disable-next-line insecure-random
    const target = Math.random()
    const f = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const stream = valve()(
      fromIterable(f.sort()),
      find(next => {
        return next === target
      })
    )

    stream.subscribe({
      next(value) {
        assert.equal(value, target)
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  // it('there can only be one', done => {
  //   valve(
  //     fromIterable([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10]),
  //     asyncMap(
  //       e =>
  //         new Promise(resolve => {
  //           setImmediate(() => {
  //             resolve(e)
  //           })
  //         })
  //     ),
  //     find({
  //       next(next) {
  //         assert.equal(action.payload, 7)
  //         done()
  //       },
  //       predicate(next) {
  //         return next >= 7
  //       }
  //     })
  //   )
  // })
  //
  it('identity', done => {
    const stream = valve()(
      fromIterable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      find()
    )

    stream.subscribe({
      next(value) {
        assert.equal(value, 1)
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('error', done => {
    const ERR = new Error('test')

    const stream = valve<typeof ERR>()(error(ERR), find())

    stream.subscribe({
      error(err) {
        assert.equal(err, ERR)
        done()
      }
    })

    stream.schedule()
  })

  it('empty', done => {
    const stream = valve()(empty(), find())

    stream.subscribe({
      complete() {
        done()
      }
    })

    stream.schedule()
  })
})

describe('sinks/reduce', () => {
  it('with initial value', done => {
    const stream = valve()(fromIterable([1, 2, 3]), reduce((a, b) => a + b, 10))

    stream.subscribe({
      next(next) {
        assert.equal(next, 16)
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('without initial value', done => {
    const stream = valve()(fromIterable([1, 2, 3]), reduce((a, b) => a + b))

    stream.subscribe({
      next(next) {
        assert.equal(next, 6)
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('error', done => {
    const ERR = new Error('qweo')

    const stream = valve()(error(ERR), reduce(noop))

    stream.subscribe({
      error(err) {
        assert.equal(err, ERR)
        done()
      }
    })

    stream.schedule()
  })

  it('error with accumulator', done => {
    const ERR = new Error('qweo')

    const stream = valve()(
      error(ERR),
      // tslint:disable-next-line restrict-plus-operands
      reduce((a, b) => a + b, 10)
    )

    stream.subscribe({
      error(err) {
        assert.equal(err, ERR)
        done()
      }
    })

    stream.schedule()
  })

  it('empty', done => {
    const stream = valve()(empty(), reduce(noop))

    stream.subscribe({
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('empty with accumulator', done => {
    const s = spy()

    const stream = valve()(empty(), reduce(() => ({}), 10))

    stream.subscribe({
      next(value) {
        s()
        assert.equal(value, 10)
      },
      complete() {
        assert.equal(s.callCount, 1)
        done()
      }
    })

    stream.schedule()
  })
})
