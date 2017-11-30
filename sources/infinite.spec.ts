import {
  collect,
  infinite,
  pull,
  take
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai';

describe('sources/infinite', () => {
  it('default', done => {
    pull(
      infinite(),
      take(5),
      collect((err, ary) => {
        expect(err).to.equal(null)
        expect(ary.length).to.equal(5)
        done()
      })
    )
  })

  it('custom', done => {
    pull(
      infinite(() => 1),
      take(5),
      collect((err, ary) => {
        expect(err).to.equal(null)
        expect(ary.length).to.equal(5)
        expect(ary).to.deep.equal([1, 1, 1, 1, 1])
        done()
      })
    )
  })
})
