import {
  collect,
  keys,
  pull
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai';

describe('sources/keys', () => {
  it('object', done => {
    pull(
      keys({ a: 1, b: 2, c: 3 }),
      collect((err, ary) => {
        expect(err).to.equal(null)
        expect(ary).to.deep.equal(['a', 'b', 'c'])
        done()
      })
    )
  })
})
