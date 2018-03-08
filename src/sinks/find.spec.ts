import { asyncMap, empty, error, find, fromIterable, valve } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

// tslint:disable-next-line
import immediate = require('immediate')

describe('sinks/find', () => {
  it('...', done => {
    valve(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      find({
        onData(action) {
          assert.equal(action.payload, 7)
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

    valve(
      fromIterable(f.sort()),
      find({
        onData(action) {
          assert.equal(action.payload, target)
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

    valve(
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

  it('there can only be one', done => {
    valve(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10]),
      asyncMap(
        e =>
          new Promise(resolve => {
            immediate(() => {
              resolve(e)
            })
          })
      ),
      find({
        onData(action) {
          assert.equal(action.payload, 7)
          done()
        },
        predicate(data) {
          return data >= 7
        }
      })
    )
  })

  it('identity', done => {
    valve(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      find({
        onData(action) {
          assert.equal(action.payload, 1)
          done()
        }
      })
    )
  })

  it('error', done => {
    const ERR = new Error('test')

    valve(
      error(ERR),
      find({
        onError(action) {
          assert.equal(action.payload, ERR)
          done()
        }
      })
    )
  })

  it('empty', done => {
    valve(
      empty(),
      find({
        onAbort() {
          done()
        }
      })
    )
  })
})
