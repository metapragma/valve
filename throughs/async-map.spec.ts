import {
  asyncMap,
  collect,
  count,
  infinite,
  pull,
  take,
  values
} from '../index'

import {
  ValveSource,
  ValveAbort,
  ValveCallback,
  ValveType
} from '../types'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'
import { spy } from 'sinon'

// tslint:disable-next-line
import immediate = require('immediate')

describe('throughs/async-map', () => {
  it('...', done => {
    pull(
      count(),
      take(21),
      asyncMap((data, cb) => {
        return cb(null, data + 1)
      }),
      collect((_, ary) => {
        expect(ary.length).to.equal(21)
        done()
      })
    )
  })

  it('abort', done => {
    const err = new Error('abort')
    const s = spy()

    const read = pull(
      infinite(),
      asyncMap((data, cb) => {
        immediate(() => {
          cb(null, data)
        })
      })
    )

    read.source(null, end => {
      if (!end) {
        done(new Error('expected read to end'))
      }

      s()
      expect(end).to.equal(err)
    })

    read.source(err, end => {
      if (!end) {
        done(new Error('expected abort to end'))
      }

      expect(end).to.equal(err)
      expect(s.callCount).to.equal(1)
      done()
    })
  })

  it('abort async source', done => {
    const err = new Error('abort')
    const s = spy()

    const read = pull(
      // tslint:disable-next-line no-shadowed-variable
      {
        type: ValveType.Source,
        source (_: ValveAbort<Error>, cb: ValveCallback<string, Error>) {
          immediate(() => {
            if (err) return cb(err)
            cb(null, 'x')
          })
        }
      },
      asyncMap((data, cb) => {
        immediate(() => {
          cb(null, data)
        })
      })
    )

    read.source(null, end => {
      s()
      if(!end) done(new Error('expected read to end'))
      expect(end).to.equal(err)
    })

    read.source(err, end => {
      if(!end) done(new Error('expected abort to end'))
      expect(end).to.equal(err)
      expect(s.callCount).to.equal(1)
      done()
    })
  })

  it('abort on error', done => {
    const ERR = new Error('abort')

    pull(
      values([1,2,3], err => {
        // console.log('on abort')
        expect(err).to.equal(ERR)
        done()
      }),
      asyncMap((_, cb) => {
        cb(ERR)
      }),
      collect(err => {
        expect(err).to.equal(ERR)
      })
    )
  })
})
