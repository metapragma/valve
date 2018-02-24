import { collect, pull, values } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/values', () => {
  it('set', done => {
    pull(
      values(new Set([1, 2, 3])),
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
      values(new Map([['one', 1], ['two', 2]])),
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
      values([1, 2, 3]),
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
      values(genFunc()),
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
      values(Object.values({ a: 1, b: 2, c: 3 })),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3])
          done()
        }
      })
    )
  })
})
