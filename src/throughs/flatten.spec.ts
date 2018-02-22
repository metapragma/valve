import { collect, error, flatten, onEnd, pull, through, values } from '../index'

import { ValveAbort } from '../types'

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
      collect((err, numbers) => {
        expect(err).to.equal(false)
        expect(numbers).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
        done()
      })
    )
  })

  it('stream of arrays of string', done => {
    pull(
      values([['a', 'b', 'c'], ['d', 'e', 'f']]),
      flatten(),
      collect((err, strings) => {
        expect(err).to.equal(false)
        expect(strings).to.deep.equal(['a', 'b', 'c', 'd', 'e', 'f'])
        done()
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
      collect((err, numbers) => {
        expect(err).to.equal(false)
        expect(numbers).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
        done()
      })
    )
  })

  it('stream of string streams', done => {
    pull(
      values([values(['a', 'b', 'c']), values(['d', 'e', 'f'])]),
      flatten(),
      collect((err, strings) => {
        expect(err).to.equal(false)
        expect(strings).to.deep.equal(['a', 'b', 'c', 'd', 'e', 'f'])
        done()
      })
    )
  })

  it('through', done => {
    pull(
      values([values([1, 2, 3]), values([4, 5, 6]), values([7, 8, 9])]),
      // tslint:disable-next-line no-empty
      through(() => {}),
      flatten(),
      collect((err, numbers) => {
        expect(err).to.equal(false)
        expect(numbers).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])
        done()
      })
    )
  })

  it('broken stream', done => {
    const _err = new Error('I am broken')
    let sosEnded: ValveAbort

    pull(
      values([error(_err)], err => {
        sosEnded = err
      }),
      flatten(),
      onEnd(err => {
        expect(err).to.equal(_err)
        immediate(() => {
          expect(sosEnded).to.equal(false) // should abort stream of streams
          done()
        })
      })
    )
  })

  it('abort', done => {
    let sosEnded: ValveAbort
    let s1Ended: ValveAbort
    let s2Ended: ValveAbort

    const stream = pull(
      values(
        [
          values([1, 2], err => {
            s1Ended = err
          }),
          values([3, 4], err => {
            s2Ended = err
          })
        ],
        err => {
          sosEnded = err
        }
      ),
      flatten()
    )

    stream.source(false, (err, data) => {
      expect(err).to.equal(false)
      expect(data).to.equal(1)

      stream.source(true, (_err, _data) => {
        expect(_err).to.equal(true)

        immediate(() => {
          expect(sosEnded).to.equal(false) // should abort stream of streams
          expect(s1Ended).to.equal(false) // should abort current nested stream
          expect(s2Ended).to.equal(undefined) // should not abort queued nested stream
          done()
        })
      })
    })
  })

  it('abort before first read', done => {
    let sosEnded: ValveAbort
    let s1Ended: ValveAbort

    const stream = pull(
      values(
        [
          values([1, 2], err => {
            s1Ended = err
          })
        ],
        err => {
          sosEnded = err
        }
      ),
      flatten()
    )

    stream.source(true, (err, data) => {
      expect(err).to.equal(true)
      expect(data).to.equal(undefined)

      immediate(() => {
        expect(sosEnded).to.equal(false) // should abort stream of streams
        expect(s1Ended).to.equal(undefined) // should abort current nested stream
        done()
      })
    })
  })

  it('flattern handles stream with normal objects', done => {
    pull(
      values([[1, 2, 3], 4, [5, 6, 7], 8, 9, 10]),
      flatten(),
      collect((err, ary) => {
        expect(err).to.equal(false)
        expect(ary).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        done()
      })
    )
  })

  it('flattern handles stream mixed objects', done => {
    pull(
      values([[1, 2, 3], 4, values([5, 6, 7]), 8, 9, 10]),
      flatten(),
      collect((err, ary) => {
        expect(err).to.equal(false)
        expect(ary).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        done()
      })
    )
  })
})
