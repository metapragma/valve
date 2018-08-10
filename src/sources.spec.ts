import {
  collect,
  count,
  empty,
  error,
  fromIterable,
  infinite,
  once,
  take,
  valve
} from './index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/count', () => {
  it('...', done => {
    valve()(
      count(5),
      collect({
        next(next) {
          assert.deepEqual(next, [1, 2, 3, 4, 5])
          done()
        }
      })
    )
  })
})

describe('sources/empty', () => {
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
})

describe('sources/error', () => {
  it('...', done => {
    const ee = new Error('Some error')

    valve<typeof ee>()(
      error(ee),
      collect({
        error(err) {
          assert.equal(err, ee)
          done()
        }
      })
    )
  })
})

describe('sources/fromIterable', () => {
  it('set', done => {
    valve()(
      fromIterable(new Set([1, 2, 3])),
      collect({
        next(next) {
          assert.deepEqual(next, [1, 2, 3])
          done()
        }
      })
    )
  })

  it('map', done => {
    valve()(
      fromIterable(new Map([['one', 1], ['two', 2]])),
      collect({
        next(next) {
          assert.deepEqual(next, [['one', 1], ['two', 2]])
          done()
        }
      })
    )
  })

  it('array', done => {
    valve()(
      fromIterable([1, 2, 3]),
      collect({
        next(next) {
          assert.deepEqual(next, [1, 2, 3])
          done()
        }
      })
    )
  })

  it('arrayLike', done => {
    valve()(
      fromIterable({ length: 2, 0: 'Alpha', 1: 'Beta' }),
      collect({
        next(next) {
          assert.deepEqual(next, ['Alpha', 'Beta'])
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

    valve()(
      fromIterable(genFunc(), false),
      collect({
        error(_err) {
          assert.deepEqual(_err, err)
          done()
        }
      })
    )
  })

  it('object', done => {
    valve()(
      fromIterable(Object.values({ a: 1, b: 2, c: 3 })),
      collect({
        next(next) {
          assert.deepEqual(next, [1, 2, 3])
          done()
        }
      })
    )
  })
})

describe('sources/infinite', () => {
  it('default', done => {
    valve()(
      infinite(),
      take(5),
      collect({
        next(next) {
          assert.equal(next.length, 5)
          done()
        }
      })
    )
  })

  it('custom', done => {
    valve()(
      infinite(() => 's'),
      take(3),
      collect({
        next(next) {
          assert.deepEqual(next, ['s', 's', 's'])
          done()
        }
      })
    )
  })
})

describe('sources/once', () => {
  it('...', done => {
    valve()(
      once({ a: 1, b: 2, c: 3 }),
      collect({
        next(next) {
          assert.deepEqual(next, [{ a: 1, b: 2, c: 3 }])
          done()
        }
      })
    )
  })
})
