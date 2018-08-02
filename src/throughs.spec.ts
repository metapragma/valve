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

import { ValveActionType, ValveSource, ValveThrough, ValveThroughFactory, ValveType } from './types'

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
    valve(
      count(),
      take(21),
      delay(50),
      collect({
        onData(data) {
          assert.equal(data.length, 21)
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
        onData(data) {
          assert.equal(data.length, 21)
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
        onData(data) {
          assert.deepEqual(data, [2, 3, 4])
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
      createThrough(({ error }) => ({
        onError(err) {
          assert.equal(err, ERR)
          error(err)
          done()
        }
      })),
      collect({
        onError(err) {
          assert.equal(err, ERR)
        }
      })
    )
  })
})

describe('throughs/filter-not', () => {
  it('random', done => {
    valve(
      infinite(),
      filterNot(d => {
        return d > 0.5
      }),
      take(100),
      collect({
        onData(data) {
          assert.equal(data.length, 100)

          data.forEach(d => {
            assert.equal(d < 0.5, true)
            assert.equal(d <= 1, true)
          })

          done()
        }
      })
    )
  })

  it('regexp', done => {
    valve(
      infinite(),
      map(d => {
        return Math.round(d * 1000).toString(16)
      }),
      filterNot(n => /^[^e]+$/i.test(n)), // no E
      take(37),
      collect({
        onData(data) {
          assert.equal(data.length, 37)
          data.forEach(d => {
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
    valve(
      count(10),
      filter(d => {
        return d >= 5
      }),
      collect({
        onData(data) {
          assert.deepEqual(data, [5, 6, 7, 8, 9, 10])
          done()
        }
      })
    )
  })

  it('random', done => {
    valve(
      infinite(),
      filter(d => {
        return d > 0.5
      }),
      take(100),
      collect({
        onData(data) {
          assert.equal(data.length, 100)

          data.forEach(d => {
            assert.isOk(d > 0.5)
            assert.isOk(d <= 1)
          })

          done()
        }
      })
    )
  })

  it('regexp', done => {
    valve(
      infinite(),
      map(d => {
        return Math.round(d * 1000).toString(16)
      }),
      filter(n => /^[^e]+$/i.test(n)), // no E
      take(37),
      collect({
        onData(data) {
          assert.equal(data.length, 37)
          data.forEach(d => {
            assert.notInclude(d, 'e')
          })

          done()
        }
      })
    )
  })

  it('empty', done => {
    valve(
      empty(),
      filter(() => {
        return false
      }),
      collect({
        onData(data) {
          assert.deepEqual(data, [])
          done()
        }
      })
    )
  })

  it('error', done => {
    const ERR = new Error('qwe')

    valve(
      error(ERR),
      filter(() => {
        return false
      }),
      collect({
        onError(err) {
          assert.equal(err, ERR)
          done()
        }
      })
    )
  })
})

describe('throughs/map', () => {
  it('...', done => {
    valve(
      fromIterable([1, 2, 3, 4, 5, 6]),
      map(n => {
        return n + 1
      }),
      collect({
        onData(data) {
          assert.deepEqual(data, [2, 3, 4, 5, 6, 7])
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
        valve(
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

    valve(
      fromIterable(numbers),
      nonUnique(),
      collect({
        onData(data) {
          assert.deepEqual(data.sort(), [0, 1, 2, 2, 3, 4, 6])
          done()
        }
      })
    )
  })
})

describe('throughs/take', () => {
  it('...', done => {
    valve(
      fromIterable([1]),
      take(0),
      collect({
        onData(data) {
          assert.deepEqual(data, [])
          done()
        }
      })
    )
  })

  it('...', done => {
    valve(
      fromIterable([1, 2, undefined, 4, 5, 6, 7, 8, 9, 10]),
      take(5),
      collect({
        onData(data) {
          assert.deepEqual(data, [1, 2, undefined, 4, 5])
          done()
        }
      })
    )
  })

  it('...', done => {
    valve(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      take(5),
      createThrough(({ abort }) => ({
        onAbort() {
          setImmediate(() => {
            done()
          })

          abort()
        }
      })),
      collect({
        onData(data) {
          assert.deepEqual(data, [1, 2, 3, 4, 5])
        }
      })
    )
  })

  it('error', done => {
    const ERR = new Error()

    valve(
      error(ERR),
      take(0),
      collect({
        onError(err) {
          assert.deepEqual(err, ERR)
          done()
        }
      })
    )
  })

  it('empty', done => {
    valve(
      empty(),
      take(0),
      collect({
        onData(data) {
          assert.deepEqual(data, [])
          done()
        }
      })
    )
  })

  it('exclude last', done => {
    valve(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      take(n => {
        return n < 5
      }),
      collect({
        onData(data) {
          assert.deepEqual(data, [1, 2, 3, 4])
          done()
        }
      })
    )
  })

  it('include last', done => {
    valve(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      take(n => {
        return n < 5
      }, true),
      collect({
        onData(data) {
          assert.deepEqual(data, [1, 2, 3, 4, 5])
          done()
        }
      })
    )
  })

  it('upstream', done => {
    const pulls = spy()
    const pushes = spy()

    function thr<P, E>(): ValveThroughFactory<P, P, E> {
      return assign<() => ValveThrough<P, P, E>, { type: ValveType.Through }>(
        () => source => (action, cb) => {
          // tslint:disable-next-line no-increment-decrement
          if (action.type === ValveActionType.Pull) pulls()
          source(action, _action => {
            if (_action.type === ValveActionType.Data) pushes()
            cb(_action)
          })
        },
        { type: ValveType.Through }
      )
    }

    valve(
      fromIterable([1, 2, 3, 4, 5, 5, 7, 5, 9, 10]),
      thr(),
      take(5),
      collect({
        onData(data) {
          assert.deepEqual(data, [1, 2, 3, 4, 5])
          setImmediate(() => {
            assert.equal(pulls.callCount, 5)
            assert.equal(pushes.callCount, 5)
            done()
          })
        }
      })
    )
  })

  it('abort', done => {
    const ary = [1, 2, 3, 4, 5]
    let ended = false
    let i = 0

    const read = valve(
      assign<() => ValveSource<number>, { type: ValveType.Source }>(
        () => (action, cb) => {
          if (hasEnded(action)) {
            ended = true
            cb(action)
          } else if (i > ary.length) {
            cb({ type: ValveActionType.Abort })
          } else {
            cb({
              type: ValveActionType.Data,
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

    instance({ type: ValveActionType.Pull }, () => {
      assert.notOk(ended)
      instance({ type: ValveActionType.Pull }, () => {
        assert.notOk(ended)
        instance({ type: ValveActionType.Pull }, () => {
          assert.notOk(ended)
          instance({ type: ValveActionType.Pull }, action => {
            assert.equal(action.type, ValveActionType.Abort)
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

    valve(
      count(5),
      createThrough(),
      createThrough(({ data }) => ({
        onData(payload) {
          assert.isNumber(payload)
          s()
          data(payload)
        }
      })),
      collect({
        onData(data) {
          assert.equal(s.callCount, 5)
          assert.deepEqual(data, [1, 2, 3, 4, 5])
          done()
        }
      })
    )
  })

  it('onEnd', done => {
    valve(
      infinite(),
      createThrough(({ abort }) => ({
        onAbort() {
          abort()

          setImmediate(() => {
            done()
          })
        }
      })),
      take(10),
      collect({
        onData(data) {
          assert.equal(data.length, 10)
        }
      })
    )
  })

  it('error', done => {
    const s = spy()
    const ERR = new Error('bla')

    valve(
      error(ERR),
      createThrough(({ error }) => ({
        onError(err) {
          assert.deepEqual(err, ERR)
          s()
          error(err)
        }
      })),
      collect({
        onError(err) {
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

    valve(
      fromIterable(numbers),
      unique(),
      collect({
        onData(data) {
          assert.deepEqual(data.sort(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
          done()
        }
      })
    )
  })

  it('iteratee', done => {
    const numbers = [0.1, 0.6, 1.1, 1.6]

    valve(
      fromIterable(numbers),
      unique(Math.floor),
      collect({
        onData(data) {
          assert.deepEqual(data.sort(), [0.1, 1.1])
          done()
        }
      })
    )
  })
})

// describe('throughs/flatten', () => {
//   it('stream of arrays of numbers', done => {
//     valve(
//       fromIterable([[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
//       flatten(),
//       collect({
//         onData(action) {
//           expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
//
//           done()
//         }
//       })
//     )
//   })
//
//   it('stream of arrays of string', done => {
//     valve(
//       fromIterable([['a', 'b', 'c'], ['d', 'e', 'f']]),
//       flatten(),
//       collect({
//         onData(action) {
//           expect(action.payload).to.deep.equal(['a', 'b', 'c', 'd', 'e', 'f'])
//
//           done()
//         }
//       })
//     )
//   })
//
//   it('stream of number streams', done => {
//     valve(
//       fromIterable([fromIterable([1, 2, 3]), fromIterable([4, 5, 6]), fromIterable([7, 8, 9])]),
//       flatten(),
//       collect({
//         onData(action) {
//           expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
//
//           done()
//         }
//       })
//     )
//   })
//
//   it('stream of string streams', done => {
//     valve(
//       fromIterable([fromIterable(['a', 'b', 'c']), fromIterable(['d', 'e', 'f'])]),
//       flatten(),
//       collect({
//         onData(action) {
//           expect(action.payload).to.deep.equal(['a', 'b', 'c', 'd', 'e', 'f'])
//
//           done()
//         }
//       })
//     )
//   })
//
//   it('through', done => {
//     valve(
//       fromIterable([fromIterable([1, 2, 3]), fromIterable([4, 5, 6]), fromIterable([7, 8, 9])]),
//       // tslint:disable-next-line no-empty
//       through(),
//       flatten(),
//       collect({
//         onData(action) {
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
//     valve(
//       fromIterable([error(err)]),
//       flatten(),
//       createSink({
//         onError(action) {
//           expect(action.payload).to.equal(err)
//           setImmediate(() => {
//             expect(action.payload).to.equal(err) // should abort stream of streams
//             done()
//           })
//         }
//       })
//     )
//   })
//
//   it('abort', done => {
//     let s1Ended: {}
//     let s2Ended: {}
//     let s3Ended: {}
//
//     const stream = valve(
//       valve(
//         fromIterable([
//           valve(
//             fromIterable([1, 2]),
//             through({
//               onAbort(action) {
//                 s1Ended = action
//               }
//             })
//           ),
//           valve(
//             fromIterable([3, 4]),
//             through({
//               onAbort(action) {
//                 s2Ended = action
//               }
//             })
//           )
//         ]),
//         through({
//           onAbort(action) {
//             s3Ended = action
//           }
//         })
//       ),
//       flatten()
//     )
//
//     stream.source({ type: ValveActionType.Pull }, act => {
//       if (act.type !== ValveActionType.Noop) {
//         done(new Error('Action type mismatch'))
//       } else {
//         stream.source({ type: ValveActionType.Pull }, action => {
//           if (action.type === ValveActionType.Data) {
//             expect(action.payload).to.equal(1)
//           } else {
//             done(new Error('Action type mismatch'))
//           }
//
//           stream.source({ type: ValveActionType.Abort }, _action => {
//             expect(_action.type).to.equal(ValveActionType.Abort)
//
//             setImmediate(() => {
//               expect(s3Ended).to.deep.equal({ type: ValveActionType.Abort }) // should abort stream of streams
//               expect(s1Ended).to.deep.equal({ type: ValveActionType.Abort }) // should abort current nested stream
//               expect(s2Ended).to.equal(undefined) // should not abort queued nested stream
//               done()
//             })
//           })
//         })
//       }
//     })
//   })
//
//   it('abort before first read', done => {
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
//     const stream = valve(
//       valve(
//         fromIterable([
//           valve(
//             fromIterable([1, 2]),
//             through({
//               onAbort(action) {
//                 s1Ended = action
//               }
//             })
//           )
//         ]),
//         through({
//           onAbort(action) {
//             sosEnded = action
//           }
//         })
//       ),
//       flatten()
//     )
//
//     stream.source({ type: ValveActionType.Abort }, action => {
//       expect(action.type).to.equal(ValveActionType.Abort)
//
//       setImmediate(() => {
//         expect(sosEnded).to.deep.equal({ type: ValveActionType.Abort }) // should abort stream of streams
//         expect(s1Ended).to.equal(undefined) // should abort current nested stream
//         done()
//       })
//     })
//   })
//
//   it('flattern handles stream with normal objects', done => {
//     valve(
//       fromIterable([[1, 2, 3], 4, [5, 6, 7], 8, 9, 10]),
//       flatten(),
//       collect({
//         onData(action) {
//           expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
//
//           done()
//         }
//       })
//     )
//   })
//
//   it('flattern handles stream mixed objects', done => {
//     valve(
//       fromIterable([[1, 2, 3], 4, fromIterable([5, 6, 7]), 8, 9, 10]),
//       flatten(),
//       collect({
//         onData(action) {
//           expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
//
//           done()
//         }
//       })
//     )
//   })
// })
