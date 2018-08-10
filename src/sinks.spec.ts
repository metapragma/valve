import {
  collect,
  concat,
  count,
  createThrough,
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

import { noop } from 'lodash'

describe('sinks/collect', () => {
  it('...', done => {
    valve()(
      empty(),
      collect({
        next(next) {
          assert.deepEqual(next, [])

          done()
        }
      })
    )
  })

  it('...', done => {
    valve()(
      count(3),
      collect({
        next(next) {
          assert.deepEqual(next, [1, 2, 3])

          done()
        }
      })
    )
  })
})

describe('sinks/concat', () => {
  it('...', done => {
    let n = 0

    valve()(
      fromIterable('hello there this is a test'.split(/([aeiou])/)),
      createThrough(({ next }) => ({
        next(str) {
          // tslint:disable-next-line no-increment-decrement
          n++

          next(str)
        }
      })),
      concat({
        next(next) {
          assert.deepEqual(next, 'hello there this is a test')
          assert.equal(n, 17)
          done()
        }
      })
    )
  })
})

describe('sinks/find', () => {
  it('...', done => {
    valve()(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      find({
        next(next) {
          assert.equal(next, 7)
          done()
        },
        predicate(next) {
          return next === 7
        }
      })
    )
  })

  it('random', done => {
    // tslint:disable-next-line insecure-random
    const target = Math.random()
    // tslint:disable-next-line insecure-random
    const f = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(Math.random)

    f.push(target)

    valve()(
      fromIterable(f.sort()),
      find({
        next(next) {
          assert.equal(next, target)
          done()
        },
        predicate(next) {
          return next === target
        }
      })
    )
  })

  it('missing', done => {
    // tslint:disable-next-line insecure-random
    const target = Math.random()
    const f = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    valve()(
      fromIterable(f.sort()),
      find({
        complete() {
          done()
        },
        predicate(next) {
          return next === target
        }
      })
    )
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

  it('identity', done => {
    valve()(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      find({
        next(next) {
          assert.equal(next, 1)
          done()
        }
      })
    )
  })

  it('error', done => {
    const ERR = new Error('test')

    valve<typeof ERR>()(
      error(ERR),
      find({
        error(err) {
          assert.equal(err, ERR)
          done()
        }
      })
    )
  })

  it('empty', done => {
    valve()(
      empty(),
      find({
        complete() {
          done()
        }
      })
    )
  })
})

describe('sinks/reduce', () => {
  it('with initial value', done => {
    valve()(
      fromIterable([1, 2, 3]),
      reduce({
        iteratee(a, b) {
          return a + b
        },
        next(next) {
          assert.equal(next, 16)
          done()
        },
        accumulator: 10
      })
    )
  })

  it('without initial value', done => {
    valve()(
      fromIterable([1, 2, 3]),
      reduce({
        iteratee(a, b) {
          return a + b
        },
        next(next) {
          assert.equal(next, 6)
          done()
        }
      })
    )
  })

  it('error', done => {
    const ERR = new Error('qweo')

    valve()(
      error(ERR),
      reduce({
        iteratee: noop,
        error(err) {
          assert.equal(err, ERR)
          done()
        }
      })
    )
  })

  it('error with accumulator', done => {
    const ERR = new Error('qweo')

    valve()(
      error(ERR),
      reduce({
        // tslint:disable-next-line restrict-plus-operands
        iteratee: (a, b) => a + b,
        error(err) {
          assert.equal(err, ERR)
          done()
        },
        accumulator: 10
      })
    )
  })

  it('empty', done => {
    valve()(
      empty(),
      reduce({
        iteratee: noop,
        complete() {
          done()
        }
      })
    )
  })

  // it('empty with accumulator', done => {
  //   valve()(
  //     empty(),
  //     reduce({
  //       iteratee: () => {},
  //       next(next) {
  //         assert.equal(next, 10)
  //         done()
  //       },
  //       accumulator: 10
  //     })
  //   )
  // })
})
