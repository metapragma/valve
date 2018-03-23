import {
  asyncMap,
  collect,
  count,
  fromIterable,
  take,
  through,
  valve
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

function delay(ms: number) {
  return asyncMap<number, number>(
    (e: number) =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(e + 1)
        }, ms)
      })
  )
}

describe('throughs/async-map', () => {
  it('...', done => {
    valve(
      count(),
      take(21),
      delay(50),
      collect({
        onData(action) {
          assert.equal(action.payload.length, 21)
          done()
        }
      })
    )
  })

  it('...', done => {
    valve(
      count(),
      take(21),
      asyncMap(data => Promise.resolve(data + 1)),
      collect({
        onData(action) {
          assert.equal(action.payload.length, 21)
          done()
        }
      })
    )
  })

  it('...', done => {
    valve(
      fromIterable([1, 2, 3]),
      asyncMap(data => Promise.resolve(data + 1)),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [2, 3, 4])
          done()
        }
      })
    )
  })

  it('abort on error', done => {
    const ERR = new Error('abort')

    valve(
      fromIterable([1, 2, 3]),
      asyncMap(() => Promise.reject(ERR)),
      through({
        onError(action) {
          assert.equal(action.payload, ERR)
          done()
        }
      }),
      collect({
        onError(action) {
          assert.equal(action.payload, ERR)
        }
      })
    )
  })
})
