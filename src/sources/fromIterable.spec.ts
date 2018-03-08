import { collect, fromIterable, pull } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/fromIterable', () => {
  it('set', done => {
    pull(
      fromIterable(new Set([1, 2, 3])),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3])
          done()
        }
      })
    )
  })

  it('map', done => {
    pull(
      fromIterable(new Map([['one', 1], ['two', 2]])),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [['one', 1], ['two', 2]])
          done()
        }
      })
    )
  })

  it('array', done => {
    pull(
      fromIterable([1, 2, 3]),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3])
          done()
        }
      })
    )
  })

  it('error', done => {
    const err = new Error('Problem!')

    function* genFunc(): IterableIterator<string> {
      yield 'qweqwe'

      throw err
    }

    pull(
      fromIterable(genFunc()),
      collect({
        onError(action) {
          assert.deepEqual(action.payload, err)
          done()
        }
      })
    )
  })

  it('object', done => {
    pull(
      fromIterable(Object.values({ a: 1, b: 2, c: 3 })),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3])
          done()
        }
      })
    )
  })
})
