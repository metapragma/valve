import {
  collect,
  drain,
  pull,
  values
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

describe('sources/values', () => {
  it('array', done => {
    pull(
      values([1, 2, 3]),
      collect((err, ary) => {
        expect(err).to.equal(null)
        expect(ary).to.deep.equal([1, 2, 3])
        done()
      })
    )
  })

  it('object', done => {
    pull(
      values({ a: 1, b: 2, c: 3 }),
      collect((err, ary) => {
        expect(err).to.equal(null)
        expect(ary).to.deep.equal([1, 2, 3])
        done()
      })
    )
  })

  it('abort', done => {
    const err = new Error('intentional')

    const read = values([1, 2, 3], _ => {
      done()
    })

    read.source(null, (n, one) => {
      expect(n).to.equal(null)
      expect(one).to.equal(1)

      read.source(err, _err => {
        expect(_err).to.equal(err)
      })
    })
  })
})
