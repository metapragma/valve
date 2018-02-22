import { asyncMap, empty, error, find, pull, values } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

// tslint:disable-next-line
import immediate = require('immediate')

describe('sinks/find', () => {
  it('...', done => {
    pull(
      values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      find(
        (err, seven) => {
          expect(seven).to.equal(7)
          expect(err).to.equal(false)
          done()
        },
        d => {
          return d === 7
        }
      )
    )
  })

  it('random', done => {
    // tslint:disable-next-line insecure-random
    const target = Math.random()
    // tslint:disable-next-line insecure-random
    const f = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(Math.random)

    f.push(target)

    pull(
      values(f.sort()),
      find(
        (err, found) => {
          expect(found).to.equal(target)
          expect(err).to.equal(false)
          done()
        },
        d => {
          return d === target
        }
      )
    )
  })

  it('missing', done => {
    // tslint:disable-next-line insecure-random
    const target = Math.random()
    const f = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    pull(
      values(f.sort()),
      find(
        (err, found) => {
          expect(found).to.equal(undefined)
          expect(err).to.equal(false)
          done()
        },
        d => {
          return d === target
        }
      )
    )
  })

  it('there can only be one', done => {
    pull(
      values([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10]),
      asyncMap((e, cb) => {
        immediate(() => {
          cb(false, e)
        })
      }),
      find(
        (err, seven) => {
          expect(seven).to.equal(7)
          expect(err).to.equal(false)
          done()
        },
        d => {
          return d >= 7
        }
      )
    )
  })

  it('null', done => {
    pull(
      values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      find((err, first) => {
        expect(first).to.equal(1)
        expect(err).to.equal(false)
        done()
      })
    )
  })

  it('error', done => {
    const ERR = new Error('test')
    pull(
      error(ERR),
      find((err, _) => {
        expect(err).to.equal(ERR)
        done()
      }, () => true)
    )
  })

  it('empty', done => {
    pull(
      empty(),
      find((err, _) => {
        expect(err).to.equal(false)
        done()
      }, () => true)
    )
  })
})
