import { collect, pull, take, through, values } from '../index'

import { ValveAbort, ValveCallback, ValveThrough, ValveType } from '../types'

// tslint:disable-next-line
import immediate = require('immediate')

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

describe('throughs/take', () => {
  it('...', done => {
    const data = [1]

    pull(
      values(data),
      take(0),
      collect((_, ary) => {
        expect(ary).to.deep.equal([])
        done()
      })
    )
  })

  it('...', done => {
    const data = [1, 2, undefined, 4, 5, 6, 7, 8, 9, 10]

    pull(
      values(data),
      take(5),
      collect((_, ary) => {
        expect(ary).to.deep.equal([1, 2, undefined, 4, 5])
        done()
      })
    )
  })

  it('...', done => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    pull(
      values(data),
      take(5),
      through(undefined, _ => {
        immediate(() => {
          done()
        })
      }),
      collect((_, ary) => {
        expect(ary).to.deep.equal([1, 2, 3, 4, 5])
      })
    )
  })

  it('exclude last', done => {
    pull(
      values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      take(n => {
        return n < 5
      }),
      collect((_, four) => {
        expect(four).to.deep.equal([1, 2, 3, 4])
        done()
      })
    )
  })

  it('include last', done => {
    pull(
      values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      take(
        n => {
          return n < 5
        },
        { last: true }
      ),
      collect((_, five) => {
        expect(five).to.deep.equal([1, 2, 3, 4, 5])
        done()
      })
    )
  })

  it('upstream', done => {
    let reads = 0

    const thr = <P, E = Error>(): ValveThrough<P, P, E> => ({
      type: ValveType.Through,
      sink(read) {
        return {
          type: ValveType.Source,
          source(end, cb) {
            // tslint:disable-next-line no-increment-decrement
            if (end !== true) reads++
            read.source(end, cb)
          }
        }
      }
    })

    pull(
      values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      thr(),
      take(5),
      collect((_, five) => {
        expect(five).to.deep.equal([1, 2, 3, 4, 5])
        immediate(() => {
          expect(reads).to.equal(5)
          done()
        })
      })
    )
  })

  it('abort', done => {
    const ary = [1, 2, 3, 4, 5]
    let aborted = false
    let i = 0

    const read = pull(
      {
        type: ValveType.Source,
        source(abort: ValveAbort, cb: ValveCallback<number, boolean>) {
          if (abort) cb((aborted = true))
          else if (i > ary.length) cb(true)
          else {
            // tslint:disable-next-line no-increment-decrement
            cb(false, ary[i++])
               }
        }
      },
      take(
        d => {
          return d < 3
        },
        { last: true }
      )
    )

    read.source(false, () => {
      expect(aborted).to.equal(false)
      read.source(false, () => {
        expect(aborted).to.equal(false)
        read.source(false, () => {
          expect(aborted).to.equal(false)
          read.source(false, (end, d) => {
            expect(end).to.equal(true)
            // t.ok(end, 'stream ended')
            expect(d).to.equal(undefined)
            // t.equal(d, undefined, 'data undefined')
            // t.ok(aborted, 'has aborted by now')
            expect(aborted).to.equal(true)
            done()
          })
        })
      })
    })
  })
})
