import { empty, error, fromIterable, pull, reduce } from '../index'

import { noop } from 'lodash'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sinks/reduce', () => {
  it('with initial value', done => {
    pull(
      fromIterable([1, 2, 3]),
      reduce({
        iteratee(a, b) {
          return a + b
        },
        onData(action) {
          assert.equal(action.payload, 16)
          done()
        },
        accumulator: 10
      })
    )
  })

  it('without initial value', done => {
    pull(
      fromIterable([1, 2, 3]),
      reduce({
        iteratee(a, b) {
          return a + b
        },
        onData(action) {
          assert.equal(action.payload, 6)
          done()
        }
      })
    )
  })

  it('error', done => {
    const ERR = new Error('qweo')

    pull(
      error(ERR),
      reduce({
        iteratee: noop,
        onError(action) {
          assert.equal(action.payload, ERR)
          done()
        }
      })
    )
  })

  it('error with accumulator', done => {
    const ERR = new Error('qweo')

    pull(
      error<number>(ERR),
      reduce({
        iteratee: (a, b) => a + b,
        onError(action) {
          assert.equal(action.payload, ERR)
          done()
        },
        accumulator: 10
      })
    )
  })

  it('empty', done => {
    pull(
      empty(),
      reduce({
        iteratee: noop,
        onAbort() {
          done()
        }
      })
    )
  })

  it('empty with accumulator', done => {
    pull(
      empty<number>(),
      reduce({
        iteratee: (a, b) => a + b,
        onData(action) {
          assert.equal(action.payload, 10)
          done()
        },
        accumulator: 10
      })
    )
  })
})
