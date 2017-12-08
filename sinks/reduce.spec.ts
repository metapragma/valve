import {
  empty,
  error,
  pull,
  reduce,
  values
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai';

describe('sinks/reduce', () => {
  it('with initial value', done => {
    pull(
      values([1, 2, 3]),
      reduce(
        (a, b) => {
          return a + b
        },
        (err, val) => {
          expect(err).to.equal(null)
          expect(val).to.equal(16)
          done()
        },
        10
      )
    )
  })

  it('without initial value', done => {
    pull(
      values([1, 2, 3]),
      reduce(
        (a, b) => {
          return a + b
        },
        (err, val) => {
          expect(err).to.equal(null)
          expect(val).to.equal(6)
          done()
        }
      )
    )
  })

  it('error', done => {
    const ERR = new Error('qweo')

    pull(
      error(ERR),
      reduce(
        (a: number, b: number) => {
          return a + b
        },
        (err, val) => {
          expect(err).to.equal(ERR)
          expect(val).to.equal(undefined)
          done()
        }
      )
    )
  })

  it('empty', done => {
    pull(
      empty(),
      reduce(
        (a: number, b: number) => {
          return a + b
        },
        (err, val) => {
          expect(err).to.equal(null)
          expect(val).to.equal(undefined)
          done()
        }
      )
    )
  })
})