import { collect, fromIterable, valve } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/fromIterable', () => {
  it('set', done => {
    valve(
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
    valve(
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
    valve(
      fromIterable([1, 2, 3]),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3])
          done()
        }
      })
    )
  })

  it('arrayLike', done => {
    valve(
      fromIterable({ length: 2, 0: 'Alpha', 1: 'Beta' }),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, ['Alpha', 'Beta'])
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

    valve(
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
    valve(
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
