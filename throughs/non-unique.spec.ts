import {
  collect,
  nonUnique,
  pull,
  values
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

describe('throughs/non-unique', () => {
  it('...', done => {
    const numbers = [1, 2, 2, 3, 4, 5, 6, 4, 0, 6, 7, 8, 3, 1, 2, 9, 0]

    pull(
      values(numbers),
      nonUnique(),
      collect((err, ary) => {
        expect(err).to.equal(null)
        expect(ary.sort()).to.deep.equal([0, 1, 2, 2, 3, 4, 6])
        done()
      })
    )
  })
})
