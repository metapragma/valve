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

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('pull', () => {
  it('source -> sink', done => {
    valve()(
      count(4),
      createThrough(({ next }) => ({
        next(payload) {
          // console.log('through', action)
          next(payload + 1)
        }
      })),
      collect({
        next(next) {
          assert.deepEqual(next, [2, 3, 4, 5])
          done()
        }
      })
    )
  })

  it('(source -> through) -> sink', done => {
    const source = valve()(
      count(4),
      createThrough(({ next }) => ({
        next(payload) {
          // console.log('through', action)
          next(payload + 1)
        }
      }))
    )

    assert.equal(source.type, ValveType.Source)
    assert.isFunction(source)

    valve()(
      source,
      collect({
        next(next) {
          assert.deepEqual(next, [2, 3, 4, 5])
          done()
        }
      })
    )
  })

  it('source -> (through -> through) -> sink', done => {
    const through = valve()(
      createThrough<number>(({ next }) => ({
        next(payload) {
          // console.log('through', action)
          next(payload + 1)
        }
      })),
      createThrough<number>(({ next }) => ({
        next(payload) {
          // console.log('through', action)
          next(payload + 1)
        }
      }))
    )

    assert.equal(through.type, ValveType.Through)
    assert.isFunction(through)

    valve()(
      count(4),
      through,
      collect({
        next(payload) {
          assert.deepEqual(payload, [3, 4, 5, 6])
          done()
        }
      })
    )
  })

  it('source -> (through -> sink)', done => {
    const sink = valve()(
      createThrough<number>(({ next }) => ({
        next(payload) {
          // console.log('through', action)
          next(payload + 1)
        }
      })),
      collect<number>({
        next(action) {
          assert.deepEqual(action, [2, 3, 4, 5])
          done()
        }
      })
    )

    assert.equal(sink.type, ValveType.Sink)
    assert.isFunction(sink)

    valve()(count(4), sink)
  })

  it('source -> (through -> (through -> through)) -> sink', done => {
    const through = valve()(
      createThrough<number>(({ next }) => ({
        next(payload) {
          // console.log('through', action)
          next(payload + 1)
        }
      })),
      createThrough<number>(({ next }) => ({
        next(payload) {
          // console.log('through', action)
          next(payload + 1)
        }
      }))
    )

    const through2 = valve()(
      through,
      createThrough<number>(({ next }) => ({
        next(payload) {
          // console.log('through', action)
          next(payload + 1)
        }
      }))
    )

    assert.equal(through.type, ValveType.Through)
    assert.isFunction(through)

    valve()(
      count(4),
      through2,
      collect({
        next(action) {
          assert.deepEqual(action, [4, 5, 6, 7])
          done()
        }
      })
    )
  })

  it('wrap pull streams into stream', done => {
    valve()(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      map(e => e * e),
      createThrough(),
      reduce({
        iteratee(acc, next) {
          return acc + next
        },
        next(next) {
          assert.equal(next, 385)
          done()
        }
      })
    )
  })

  it('turn pull(through,...) -> Through', done => {
    valve()(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      valve()(
        map<number, number>(e => {
          return e * e
        }),
        createThrough<number, number>()
      ),
      reduce({
        iteratee(acc, next) {
          return acc + next
        },
        next(next) {
          assert.equal(next, 385)
          done()
        }
      })
    )
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

    valve()(
      read,
      collect({
        next(payload) {
          assert.deepEqual(payload, [
            '*** BILLY! ***',
            '*** JOE! ***',
            '*** ZEKE! ***'
          ])

          done()
        }
      })
    )
  })

  it('continuable stream', done => {
    // With values:
    const sA = spy()
    const sB = spy()
    const sC = spy()

    const stream = valve()(
      count(5),
      map(item => {
        sA()

        return item * 2
      }),
      createThrough()
    )

    stream()({ type: ValveMessageType.Pull }, action => {
      sB()

      if (action.type === ValveMessageType.Next) {
        assert.equal(action.payload, 2)
      } else {
        done(new Error('Action type mismatch'))
      }
    })

    stream()({ type: ValveMessageType.Pull }, action => {
      sC()

      if (action.type === ValveMessageType.Next) {
        assert.equal(action.payload, 4)
      } else {
        done(new Error('Action type mismatch'))
      }
    })

    valve()(
      stream,
      collect({
        next(next) {
          assert.equal(sA.callCount, 5)
          assert.equal(sB.callCount, 1)
          assert.equal(sC.callCount, 1)
          assert.deepEqual(next, [6, 8, 10])
          done()
        }
      })
    )
  })

  it('continuable stream (error)', done => {
    const ERR = new Error('test')

    const stream = valve<typeof ERR>()(error(ERR), createThrough())

    stream()({ type: ValveMessageType.Pull }, action => {
      if (action.type === ValveMessageType.Error) {
        assert.deepEqual(action.payload, ERR)
      } else {
        done(new Error('Action type mismatch'))
      }
    })

    stream()({ type: ValveMessageType.Pull }, action => {
      if (action.type === ValveMessageType.Error) {
        assert.deepEqual(action.payload, ERR)
        done()
      } else {
        done(new Error('Action type mismatch'))
      }
    })
  })
})
