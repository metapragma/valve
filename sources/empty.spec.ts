import {
  collect,
  empty,
  pull
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai';

describe('sources/empty', () => {
  it('...', done => {
    pull(
      empty(),
      collect((err, ary) => {
        expect(err).to.equal(null)
        expect(ary).to.deep.equal([])
        done()
      })
    )
  })
})
