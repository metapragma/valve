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
        onData(data) {
          assert.deepEqual(data, [])

          done()
        }
      })
    )
  })

  it('...', done => {
    valve()(
      count(3),
      collect({
        onData(data) {
          assert.deepEqual(data, [1, 2, 3])

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
      createThrough(({ data }) => ({
        onData(str) {
          // tslint:disable-next-line no-increment-decrement
          n++

          data(str)
        }
      })),
      concat({
        onData(data) {
          assert.deepEqual(data, 'hello there this is a test')
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
        onData(data) {
          assert.equal(data, 7)
          done()
        },
        predicate(data) {
          return data === 7
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
        onData(data) {
          assert.equal(data, target)
          done()
        },
        predicate(data) {
          return data === target
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
        onAbort() {
          done()
        },
        predicate(data) {
          return data === target
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
  //       onData(data) {
  //         assert.equal(action.payload, 7)
  //         done()
  //       },
  //       predicate(data) {
  //         return data >= 7
  //       }
  //     })
  //   )
  // })

  it('identity', done => {
    valve()(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      find({
        onData(data) {
          assert.equal(data, 1)
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
        onError(err) {
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
        onAbort() {
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
        onData(data) {
          assert.equal(data, 16)
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
        onData(data) {
          assert.equal(data, 6)
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
        onError(err) {
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
        onError(err) {
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
        onAbort() {
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
  //       onData(data) {
  //         assert.equal(data, 10)
  //         done()
  //       },
  //       accumulator: 10
  //     })
  //   )
  // })
})
