import { collect, count, pull } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

describe('sources/count', () => {
  it('...', done => {
    pull(
      count(5),
      collect((err, ary) => {
        expect(err).to.equal(false)
        expect(ary).to.deep.equal([1, 2, 3, 4, 5])
        done()
      })
    )
  })
})
