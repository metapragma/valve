// import { fromIterable, map, reduce, through, valve } from './index'
import {
  collect,
  count,
  createThrough,
  error,
  fromIterable,
  map,
  reduce,
  valve
} from './index'
import { ValveMessageType, ValveType } from './types'
import { spy } from 'sinon'

import { simpleScheduler } from './schedulers/simple'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('pull', () => {
  it('source -> sink', done => {
    const pipe = valve()

    const stream = pipe(
      count(6),
      createThrough(({ next }) => ({
        next(value) {
          // console.log('through', action)
          next(value + 1)
        }
      })),
      collect()
    )

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [2, 3, 4, 5, 6, 7])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('(source -> through) -> sink', done => {
    const source = valve()(
      count(4),
      createThrough(({ next }) => ({
        next(value) {
          // console.log('through', action)
          next(value + 1)
        }
      }))
    )

    assert.equal(source.type, ValveType.Source)
    assert.isFunction(source)

    const stream = valve()(source, collect())

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [2, 3, 4, 5])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('source -> (through -> through) -> sink', done => {
    const through = valve()(
      createThrough<number>(({ next }) => ({
        next(value) {
          // console.log('through', action)
          next(value + 1)
        }
      })),
      createThrough<number>(({ next }) => ({
        next(value) {
          // console.log('through', action)
          next(value + 1)
        }
      }))
    )

    assert.equal(through.type, ValveType.Through)
    assert.isFunction(through)

    const stream = valve()(count(4), through, collect())

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [3, 4, 5, 6])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('source -> (through -> sink)', done => {
    const sink = valve()(
      createThrough<number>(({ next }) => ({
        next(value) {
          // console.log('through', action)
          next(value + 1)
        }
      })),
      collect<number>()
    )

    assert.equal(sink.type, ValveType.Sink)
    assert.isFunction(sink)

    const stream = valve()(count(4), sink)

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [2, 3, 4, 5])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('source -> (through -> (through -> through)) -> sink', done => {
    const through = valve()(
      createThrough<number>(({ next }) => ({
        next(value) {
          // console.log('through', action)
          next(value + 1)
        }
      })),
      createThrough<number>(({ next }) => ({
        next(value) {
          // console.log('through', action)
          next(value + 1)
        }
      }))
    )

    const through2 = valve()(
      through,
      createThrough<number>(({ next }) => ({
        next(value) {
          // console.log('through', action)
          next(value + 1)
        }
      }))
    )

    assert.equal(through.type, ValveType.Through)
    assert.isFunction(through)

    const stream = valve()(count(4), through2, collect())

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [4, 5, 6, 7])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('wrap pull streams into stream', done => {
    const stream = valve()(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      map(e => e * e),
      createThrough(),
      reduce((acc, next) => {
        return acc + next
      })
    )

    stream.subscribe({
      next(value) {
        assert.equal(value, 385)
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('turn pull(through,...) -> Through', done => {
    const stream = valve()(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      valve()(
        map<number, number>(e => {
          return e * e
        }),
        createThrough<number, number>()
      ),
      reduce((acc, next) => {
        return acc + next
      })
    )

    stream.subscribe({
      next(value) {
        assert.equal(value, 385)
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  // it('writable pull() should throw when called twice', () => {
  //   const stream = valve<number, number>(
  //     map((e: number) => {
  //       return e * e
  //     }),
  //     reduce({
  //       iteratee(acc, next) {
  //         return acc + next
  //       },
  //       next(action) {
  //         assert.equal(action.payload, 385)
  //       }
  //     })
  //   )
  //
  //   stream.sink(fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
  //
  //   assert.throws(() => {
  //     stream.sink(fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
  //   }, TypeError)
  // })

  it('test through streams compose on pipe', done => {
    const pipeline = valve()(
      map((d: string) => {
        // make exciting!
        return `${d}!`
      }),
      map((d: string) => {
        // make loud
        return d.toUpperCase()
      }),
      map((d: string) => {
        // add sparkles
        return `*** ${d} ***`
      })
    )

    const read = valve()(fromIterable(['billy', 'joe', 'zeke']), pipeline)

    const stream = valve()(read, collect())

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [
          '*** BILLY! ***',
          '*** JOE! ***',
          '*** ZEKE! ***'
        ])
      },
      complete() {
        done()
      }
    })

    stream.schedule()
  })

  it('continuable stream', done => {
    // With values:
    const sA = spy()
    const sB = spy()
    const sC = spy()

    const source = valve()(
      count(5),
      map(item => {
        sA()

        return item * 2
      }),
      createThrough()
    )

    source()({ type: ValveMessageType.Pull }, action => {
      sB()

      if (action.type === ValveMessageType.Next) {
        assert.equal(action.payload, 2)
      } else {
        done(new Error('Action type mismatch'))
      }
    })

    source()({ type: ValveMessageType.Pull }, action => {
      sC()

      if (action.type === ValveMessageType.Next) {
        assert.equal(action.payload, 4)
      } else {
        done(new Error('Action type mismatch'))
      }
    })

    const stream = valve()(source, collect())

    stream.subscribe({
      next(value) {
        assert.deepEqual(value, [6, 8, 10])
      },
      complete() {
        assert.equal(sA.callCount, 5)
        assert.equal(sB.callCount, 1)
        assert.equal(sC.callCount, 1)
        done()
      }
    })

    stream.schedule()
  })

  it('continuable stream (error)', done => {
    const ERR = new Error('test')

    const source = valve<typeof ERR>()(error(ERR), createThrough())

    source()({ type: ValveMessageType.Pull }, action => {
      if (action.type === ValveMessageType.Error) {
        assert.deepEqual(action.payload, ERR)
      } else {
        done(new Error('Action type mismatch'))
      }
    })

    source()({ type: ValveMessageType.Pull }, action => {
      if (action.type === ValveMessageType.Error) {
        assert.deepEqual(action.payload, ERR)
        done()
      } else {
        done(new Error('Action type mismatch'))
      }
    })
  })
})
