/* tslint:disable no-shadowed-variable */
import { spy } from 'sinon'
import {
  asyncMap,
  collect,
  count,
  createSink,
  createThrough,
  empty,
  error,
  filter,
  filterNot,
  fromIterable,
  infinite,
  map,
  nonUnique,
  take,
  unique,
  valve
} from './index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

import {
  ValveError,
  ValveMessageType,
  ValveSource,
  ValveThrough,
  ValveThroughFactory,
  ValveType
} from './types'

import { assign } from 'lodash'

import { hasEnded } from './utilities'

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
    valve()(
      count(),
      take(21),
      delay(50),
      collect({
        next(next) {
          assert.equal(next.length, 21)
          done()
        }
      })
    )
  })

  it('...', done => {
    valve()(
      count(),
      take(21),
      asyncMap(next => Promise.resolve(next + 1)),
      collect({
        next(next) {
          assert.equal(next.length, 21)
          done()
        }
      })
    )
  })

  it('...', done => {
    valve()(
      fromIterable([1, 2, 3]),
      asyncMap(next => Promise.resolve(next + 1)),
      collect({
        next(next) {
          assert.deepEqual(next, [2, 3, 4])
          done()
        }
      })
    )
  })

  it('complete on error', done => {
    const ERR = new Error('complete')

    valve()(
      fromIterable([1, 2, 3]),
      asyncMap(() => Promise.reject(ERR)),
      createThrough(({ error }) => ({
        error(err) {
          assert.equal(err, ERR)
          error(err)
          done()
        }
      })),
      collect({
        error(err) {
          assert.equal(err, ERR)
        }
      })
    )
  })
})

describe('throughs/filter-not', () => {
  it('random', done => {
    valve()(
      infinite(),
      filterNot(d => {
        return d > 0.5
      }),
      take(100),
      collect({
        next(next) {
          assert.equal(next.length, 100)

          next.forEach(d => {
            assert.equal(d < 0.5, true)
            assert.equal(d <= 1, true)
          })

          done()
        }
      })
    )
  })

  it('regexp', done => {
    valve()(
      infinite(),
      map(d => {
        return Math.round(d * 1000).toString(16)
      }),
      filterNot(n => /^[^e]+$/i.test(n)), // no E
      take(37),
      collect({
        next(next) {
          assert.equal(next.length, 37)
          next.forEach(d => {
            assert.include(d, 'e')
          })

          done()
        }
      })
    )
  })
})

describe('throughs/filter', () => {
  it('count', done => {
    valve()(
      count(10),
      filter(d => {
        return d >= 5
      }),
      collect({
        next(next) {
          assert.deepEqual(next, [5, 6, 7, 8, 9, 10])
          done()
        }
      })
    )
  })

  it('random', done => {
    valve()(
      infinite(),
      filter(d => {
        return d > 0.5
      }),
      take(100),
      collect({
        next(next) {
          assert.equal(next.length, 100)

          next.forEach(d => {
            assert.isOk(d > 0.5)
            assert.isOk(d <= 1)
          })

          done()
        }
      })
    )
  })

  it('regexp', done => {
    valve()(
      infinite(),
      map(d => {
        return Math.round(d * 1000).toString(16)
      }),
      filter(n => /^[^e]+$/i.test(n)), // no E
      take(37),
      collect({
        next(next) {
          assert.equal(next.length, 37)
          next.forEach(d => {
            assert.notInclude(d, 'e')
          })

          done()
        }
      })
    )
  })

  it('empty', done => {
    valve()(
      empty(),
      filter(() => {
        return false
      }),
      collect({
        next(next) {
          assert.deepEqual(next, [])
          done()
        }
      })
    )
  })

  it('error', done => {
    const ERR = new Error('qwe')

    valve<typeof ERR>()(
      error(ERR),
      filter(() => {
        return false
      }),
      collect({
        error(err) {
          assert.equal(err, ERR)
          done()
        }
      })
    )
  })
})

describe('throughs/map', () => {
  it('...', done => {
    valve()(
      fromIterable([1, 2, 3, 4, 5, 6]),
      map(n => {
        return n + 1
      }),
      collect({
        next(next) {
          assert.deepEqual(next, [2, 3, 4, 5, 6, 7])
          done()
        }
      })
    )
  })

  it('error', () => {
    const err = new Error('unwholesome number')

    const sink = createSink()
    assert.throws(
      () =>
        valve()(
          fromIterable([1, 2, 3, 3.4, 4], false),
          map(e => {
            // tslint:disable-next-line no-bitwise
            if (e !== ~~e) {
              throw err
            }

            return e
          }),
          sink
        ),
      /unwholesome number/
    )
  })
})

describe('throughs/non-unique', () => {
  it('...', done => {
    const numbers = [1, 2, 2, 3, 4, 5, 6, 4, 0, 6, 7, 8, 3, 1, 2, 9, 0]

    valve()(
      fromIterable(numbers),
      nonUnique(),
      collect({
        next(next) {
          assert.deepEqual(next.sort(), [0, 1, 2, 2, 3, 4, 6])
          done()
        }
      })
    )
  })
})

describe('throughs/take', () => {
  it('...', done => {
    valve()(
      fromIterable([1]),
      take(0),
      collect({
        next(next) {
          assert.deepEqual(next, [])
          done()
        }
      })
    )
  })

  it('...', done => {
    valve()(
      fromIterable([1, 2, undefined, 4, 5, 6, 7, 8, 9, 10]),
      take(5),
      collect({
        next(next) {
          assert.deepEqual(next, [1, 2, undefined, 4, 5])
          done()
        }
      })
    )
  })

  it('...', done => {
    valve()(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      take(5),
      createThrough(({ complete }) => ({
        complete() {
          setImmediate(() => {
            done()
          })

          complete()
        }
      })),
      collect({
        next(next) {
          assert.deepEqual(next, [1, 2, 3, 4, 5])
        }
      })
    )
  })

  it('error', done => {
    const ERR = new Error()

    valve<typeof ERR>()(
      error(ERR),
      take(0),
      collect({
        error(err) {
          assert.deepEqual(err, ERR)
          done()
        }
      })
    )
  })

  it('empty', done => {
    valve()(
      empty(),
      take(0),
      collect({
        next(next) {
          assert.deepEqual(next, [])
          done()
        }
      })
    )
  })

  it('exclude last', done => {
    valve()(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      take(n => {
        return n < 5
      }),
      collect({
        next(next) {
          assert.deepEqual(next, [1, 2, 3, 4])
          done()
        }
      })
    )
  })

  it('include last', done => {
    valve()(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      take(n => {
        return n < 5
      }, true),
      collect({
        next(next) {
          assert.deepEqual(next, [1, 2, 3, 4, 5])
          done()
        }
      })
    )
  })

  it('upstream', done => {
    const pulls = spy()
    const pushes = spy()

    function thr<P, E>(): ValveThroughFactory<P, P, {}, E> {
      return assign<() => ValveThrough<P, P, E>, { type: ValveType.Through }>(
        () => source => (action, cb) => {
          // tslint:disable-next-line no-increment-decrement
          if (action.type === ValveMessageType.Pull) pulls()
          source(action, _action => {
            if (_action.type === ValveMessageType.Next) pushes()
            cb(_action)
          })
        },
        { type: ValveType.Through }
      )
    }

    valve()(
      fromIterable([1, 2, 3, 4, 5, 5, 7, 5, 9, 10]),
      thr(),
      take(5),
      collect({
        next(next) {
          assert.deepEqual(next, [1, 2, 3, 4, 5])
          setImmediate(() => {
            assert.equal(pulls.callCount, 5)
            assert.equal(pushes.callCount, 5)
            done()
          })
        }
      })
    )
  })

  it('complete', done => {
    const ary = [1, 2, 3, 4, 5]
    let ended = false
    let i = 0

    const read = valve()(
      assign<() => ValveSource<number, {}>, { type: ValveType.Source }>(
        () => (action, cb) => {
          if (hasEnded(action)) {
            ended = true
            cb(action)
          } else if (i > ary.length) {
            cb({ type: ValveMessageType.Complete })
          } else {
            cb({
              type: ValveMessageType.Next,
              // tslint:disable-next-line no-increment-decrement
              payload: ary[i++]
            })
          }
        },
        { type: ValveType.Source }
      ),
      take(d => {
        return d < 3
      }, true)
    )

    const instance = read()

    instance({ type: ValveMessageType.Pull }, () => {
      assert.notOk(ended)
      instance({ type: ValveMessageType.Pull }, () => {
        assert.notOk(ended)
        instance({ type: ValveMessageType.Pull }, () => {
          assert.notOk(ended)
          instance({ type: ValveMessageType.Pull }, action => {
            assert.equal(action.type, ValveMessageType.Complete)
            assert.isOk(ended)
            done()
          })
        })
      })
    })
  })
})

describe('throughs/through', () => {
  it('...', done => {
    const s = spy()

    valve()(
      count(5),
      createThrough(),
      createThrough(({ next }) => ({
        next(payload) {
          assert.isNumber(payload)
          s()
          next(payload)
        }
      })),
      collect({
        next(next) {
          assert.equal(s.callCount, 5)
          assert.deepEqual(next, [1, 2, 3, 4, 5])
          done()
        }
      })
    )
  })

  it('onEnd', done => {
    valve()(
      infinite(),
      createThrough(({ complete }) => ({
        complete() {
          complete()

          setImmediate(() => {
            done()
          })
        }
      })),
      take(10),
      collect({
        next(next) {
          assert.equal(next.length, 10)
        }
      })
    )
  })

  it('error', done => {
    const s = spy()
    const ERR = new Error('bla')

    valve<typeof ERR>()(
      error(ERR),
      createThrough(({ error }) => ({
        error(err) {
          assert.deepEqual(err, ERR)
          s()
          error(err)
        }
      })),
      collect({
        error(err) {
          assert.equal(s.callCount, 1)
          assert.deepEqual(err, ERR)
          done()
        }
      })
    )
  })
})

describe('throughs/unique', () => {
  it('...', done => {
    const numbers = [1, 2, 2, 3, 4, 5, 6, 4, 0, 6, 7, 8, 3, 1, 2, 9, 0]

    valve()(
      fromIterable(numbers),
      unique(),
      collect({
        next(next) {
          assert.deepEqual(next.sort(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
          done()
        }
      })
    )
  })

  it('iteratee', done => {
    const numbers = [0.1, 0.6, 1.1, 1.6]

    valve()(
      fromIterable(numbers),
      unique(Math.floor),
      collect({
        next(next) {
          assert.deepEqual(next.sort(), [0.1, 1.1])
          done()
        }
      })
    )
  })
})

// describe('throughs/flatten', () => {
//   it('stream of arrays of numbers', done => {
//     valve()(
//       fromIterable([[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
//       flatten(),
//       collect({
//         next(action) {
//           expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
//
//           done()
//         }
//       })
//     )
//   })
//
//   it('stream of arrays of string', done => {
//     valve()(
//       fromIterable([['a', 'b', 'c'], ['d', 'e', 'f']]),
//       flatten(),
//       collect({
//         next(action) {
//           expect(action.payload).to.deep.equal(['a', 'b', 'c', 'd', 'e', 'f'])
//
//           done()
//         }
//       })
//     )
//   })
//
//   it('stream of number streams', done => {
//     valve()(
//       fromIterable([fromIterable([1, 2, 3]), fromIterable([4, 5, 6]), fromIterable([7, 8, 9])]),
//       flatten(),
//       collect({
//         next(action) {
//           expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
//
//           done()
//         }
//       })
//     )
//   })
//
//   it('stream of string streams', done => {
//     valve()(
//       fromIterable([fromIterable(['a', 'b', 'c']), fromIterable(['d', 'e', 'f'])]),
//       flatten(),
//       collect({
//         next(action) {
//           expect(action.payload).to.deep.equal(['a', 'b', 'c', 'd', 'e', 'f'])
//
//           done()
//         }
//       })
//     )
//   })
//
//   it('through', done => {
//     valve()(
//       fromIterable([fromIterable([1, 2, 3]), fromIterable([4, 5, 6]), fromIterable([7, 8, 9])]),
//       // tslint:disable-next-line no-empty
//       through(),
//       flatten(),
//       collect({
//         next(action) {
//           expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
//
//           done()
//         }
//       })
//     )
//   })
//
//   it('broken stream', done => {
//     const err = new Error('I am broken')
//
//     valve()(
//       fromIterable([error(err)]),
//       flatten(),
//       createSink({
//         error(action) {
//           expect(action.payload).to.equal(err)
//           setImmediate(() => {
//             expect(action.payload).to.equal(err) // should complete stream of streams
//             done()
//           })
//         }
//       })
//     )
//   })
//
//   it('complete', done => {
//     let s1Ended: {}
//     let s2Ended: {}
//     let s3Ended: {}
//
//     const stream = valve()(
//       valve()(
//         fromIterable([
//           valve()(
//             fromIterable([1, 2]),
//             through({
//               complete(action) {
//                 s1Ended = action
//               }
//             })
//           ),
//           valve()(
//             fromIterable([3, 4]),
//             through({
//               complete(action) {
//                 s2Ended = action
//               }
//             })
//           )
//         ]),
//         through({
//           complete(action) {
//             s3Ended = action
//           }
//         })
//       ),
//       flatten()
//     )
//
//     stream.source({ type: ValveMessageType.Pull }, act => {
//       if (act.type !== ValveMessageType.Noop) {
//         done(new Error('Action type mismatch'))
//       } else {
//         stream.source({ type: ValveMessageType.Pull }, action => {
//           if (action.type === ValveMessageType.Next) {
//             expect(action.payload).to.equal(1)
//           } else {
//             done(new Error('Action type mismatch'))
//           }
//
//           stream.source({ type: ValveMessageType.Complete }, _action => {
//             expect(_action.type).to.equal(ValveMessageType.Complete)
//
//             setImmediate(() => {
//               expect(s3Ended).to.deep.equal({ type: ValveMessageType.Complete }) // should complete stream of streams
//               expect(s1Ended).to.deep.equal({ type: ValveMessageType.Complete }) // should complete current nested stream
//               expect(s2Ended).to.equal(undefined) // should not complete queued nested stream
//               done()
//             })
//           })
//         })
//       }
//     })
//   })
//
//   it('complete before first read', done => {
//     let sosEnded: {}
//     let s1Ended: {}
//
//     // const stream = pull(
//     //   pull(
//     //     fromIterable([
//     //       pull(fromIterable([1, 2]), through())
//     //     ]),
//     //     through(undefined, act => (sosEnded = act))
//     //   ),
//     //   flatten()
//     // )
//
//     const stream = valve()(
//       valve()(
//         fromIterable([
//           valve()(
//             fromIterable([1, 2]),
//             through({
//               complete(action) {
//                 s1Ended = action
//               }
//             })
//           )
//         ]),
//         through({
//           complete(action) {
//             sosEnded = action
//           }
//         })
//       ),
//       flatten()
//     )
//
//     stream.source({ type: ValveMessageType.Complete }, action => {
//       expect(action.type).to.equal(ValveMessageType.Complete)
//
//       setImmediate(() => {
//         expect(sosEnded).to.deep.equal({ type: ValveMessageType.Complete }) // should complete stream of streams
//         expect(s1Ended).to.equal(undefined) // should complete current nested stream
//         done()
//       })
//     })
//   })
//
//   it('flattern handles stream with normal objects', done => {
//     valve()(
//       fromIterable([[1, 2, 3], 4, [5, 6, 7], 8, 9, 10]),
//       flatten(),
//       collect({
//         next(action) {
//           expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
//
//           done()
//         }
//       })
//     )
//   })
//
//   it('flattern handles stream mixed objects', done => {
//     valve()(
//       fromIterable([[1, 2, 3], 4, fromIterable([5, 6, 7]), 8, 9, 10]),
//       flatten(),
//       collect({
//         next(action) {
//           expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
//
//           done()
//         }
//       })
//     )
//   })
// })
