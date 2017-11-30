import {
  collect,
  error,
  pull
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai';

describe('sources/error', () => {
  it('...', done => {
    const ee = new Error('Some error')

    pull(
      error(ee),
      collect((err, ary) => {
        expect(err).to.equal(ee)
        expect(ary).to.deep.equal([])
        done()
      })
    )
  })
})
