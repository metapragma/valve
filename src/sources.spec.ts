import {
  collect,
  count,
  empty,
  error,
  fromArray,
  fromIterable,
  infinite,
  map,
  once,
  take,
  valve
} from './index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/count', () => {
  it('...', done => {
    const stream = valve()(count(5), collect())

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [1, 2, 3, 4, 5])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })
})

describe('sources/empty', () => {
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
})

describe('sources/error', () => {
  it('...', done => {
    const ee = new Error('Some error')

    const stream = valve<typeof ee>()(error(ee), collect())

    stream.subscribe({
      error(err) {
        assert.equal(err, ee)
        done()
      }
    })

    stream.schedule()
  })
})

describe('sources/fromIterable', () => {
  it('set', done => {
    const stream = valve()(fromIterable(new Set([1, 2, 3])), collect())

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

  it('map', done => {
    const stream = valve()(
      fromIterable(new Map([['one', 1], ['two', 2]])),
      collect()
    )

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [['one', 1], ['two', 2]])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('array', done => {
    const stream = valve()(fromArray([1, 2, 3]), collect())

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

  it('arrayLike', done => {
    const stream = valve()(
      fromIterable({ length: 2, 0: 'Alpha', 1: 'Beta' }),
      collect()
    )

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, ['Alpha', 'Beta'])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('error', done => {
    const err = new Error('Problem!')

    function* genFunc(): IterableIterator<string> {
      yield 'qweqwe'

      throw err
    }

    const stream = valve()(fromIterable(genFunc(), false), collect())

    stream.subscribe({
      error(_err) {
        assert.deepEqual(_err, err)
        done()
      }
    })

    stream.schedule()
  })

  it('object', done => {
    const stream = valve()(
      fromIterable(Object.values({ a: 1, b: 2, c: 3 })),
      collect()
    )

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

describe('sources/infinite', () => {
  it('default', done => {
    const stream = valve()(infinite(), map(n => `${n}`), take(5), collect())

    stream.subscribe({
      next(value) {
        assert.equal(value.length, 5)
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('custom', done => {
    const stream = valve()(infinite(() => 's'), take(3), collect())

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, ['s', 's', 's'])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })
})

describe('sources/once', () => {
  it('...', done => {
    const stream = valve()(once({ a: 1, b: 2, c: 3 }), collect())

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [{ a: 1, b: 2, c: 3 }])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })
})
