import { collect, error, flatten, pull, through, values } from '../index'

import { ValveActionType } from '../types'

import { createSink } from '../utilities'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

// tslint:disable-next-line
import immediate = require('immediate')

describe('throughs/flatten', () => {
  it('stream of arrays of numbers', done => {
    pull(
      values([[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
      flatten(),
      collect({
        onData(action) {
          expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])

          done()
        }
      })
    )
  })

  it('stream of arrays of string', done => {
    pull(
      values([['a', 'b', 'c'], ['d', 'e', 'f']]),
      flatten(),
      collect({
        onData(action) {
          expect(action.payload).to.deep.equal(['a', 'b', 'c', 'd', 'e', 'f'])

          done()
        }
      })
    )
  })

  // it('objects', done => {
  //   pull(
  //     values([
  //       { a: 1, b: 2, c: 3 },
  //       { a: 4, b: 5, c: 6 },
  //       { a: 7, b: 8, c: 9 }
  //     ]),
  //     flatten(),
  //     collect((err, numbers) => {
  //       expect(err).to.equal(null)
  //       expect(numbers).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
  //       done()
  //     })
  //   )
  // })
  //
  // it('stream (objects)', done => {
  //   pull(
  //     values([
  //       values({ a: 1, b: 2, c: 3 }),
  //       values({ a: 4, b: 5, c: 6 }),
  //       values({ a: 7, b: 8, c: 9 })
  //     ]),
  //     flatten(),
  //     collect((err, numbers) => {
  //       expect(err).to.equal(null)
  //       expect(numbers).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
  //       done()
  //     })
  //   )
  // })

  it('stream of number streams', done => {
    pull(
      values([values([1, 2, 3]), values([4, 5, 6]), values([7, 8, 9])]),
      flatten(),
      collect({
        onData(action) {
          expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])

          done()
        }
      })
    )
  })

  it('stream of string streams', done => {
    pull(
      values([values(['a', 'b', 'c']), values(['d', 'e', 'f'])]),
      flatten(),
      collect({
        onData(action) {
          expect(action.payload).to.deep.equal(['a', 'b', 'c', 'd', 'e', 'f'])

          done()
        }
      })
    )
  })

  it('through', done => {
    pull(
      values([values([1, 2, 3]), values([4, 5, 6]), values([7, 8, 9])]),
      // tslint:disable-next-line no-empty
      through(),
      flatten(),
      collect({
        onData(action) {
          expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])

          done()
        }
      })
    )
  })

  it('broken stream', done => {
    const err = new Error('I am broken')

    pull(
      values([error(err)]),
      flatten(),
      createSink({
        onError(action) {
          expect(action.payload).to.equal(err)
          immediate(() => {
            expect(action.payload).to.equal(err) // should abort stream of streams
            done()
          })
        }
      })
    )
  })

  it('abort', done => {
    let s1Ended: {}
    let s2Ended: {}
    let s3Ended: {}

    const stream = pull(
      pull(
        values([
          pull(
            values([1, 2]),
            through({
              onAbort(action) {
                s1Ended = action
              }
            })
          ),
          pull(
            values([3, 4]),
            through({
              onAbort(action) {
                s2Ended = action
              }
            })
          )
        ]),
        through({
          onAbort(action) {
            s3Ended = action
          }
        })
      ),
      flatten()
    )

    stream.source({ type: ValveActionType.Pull }, action => {
      if (action.type === ValveActionType.Data) {
        expect(action.payload).to.equal(1)
      } else {
        done(new Error('Action type mismatch'))
      }

      stream.source({ type: ValveActionType.Abort }, _action => {
        expect(_action.type).to.equal(ValveActionType.Abort)

        immediate(() => {
          expect(s3Ended).to.deep.equal({ type: ValveActionType.Abort }) // should abort stream of streams
          expect(s1Ended).to.deep.equal({ type: ValveActionType.Abort }) // should abort current nested stream
          expect(s2Ended).to.equal(undefined) // should not abort queued nested stream
          done()
        })
      })
    })
  })

  it('abort before first read', done => {
    let sosEnded: {}
    let s1Ended: {}

    // const stream = pull(
    //   pull(
    //     values([
    //       pull(values([1, 2]), through())
    //     ]),
    //     through(undefined, act => (sosEnded = act))
    //   ),
    //   flatten()
    // )

    const stream = pull(
      pull(
        values([
          pull(
            values([1, 2]),
            through({
              onAbort(action) {
                s1Ended = action
              }
            })
          )
        ]),
        through({
          onAbort(action) {
            sosEnded = action
          }
        })
      ),
      flatten()
    )

    stream.source({ type: ValveActionType.Abort }, action => {
      expect(action.type).to.equal(ValveActionType.Abort)

      immediate(() => {
        expect(sosEnded).to.deep.equal({ type: ValveActionType.Abort }) // should abort stream of streams
        expect(s1Ended).to.equal(undefined) // should abort current nested stream
        done()
      })
    })
  })

  it('flattern handles stream with normal objects', done => {
    pull(
      values([[1, 2, 3], 4, [5, 6, 7], 8, 9, 10]),
      flatten(),
      collect({
        onData(action) {
          expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

          done()
        }
      })
    )
  })

  it('flattern handles stream mixed objects', done => {
    pull(
      values([[1, 2, 3], 4, values([5, 6, 7]), 8, 9, 10]),
      flatten(),
      collect({
        onData(action) {
          expect(action.payload).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

          done()
        }
      })
    )
  })
})
