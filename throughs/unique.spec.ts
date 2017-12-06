import {
  collect,
  pull,
  unique,
  values
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

describe('throughs/unique', () => {
  it('...', done => {
    const numbers = [1, 2, 2, 3, 4, 5, 6, 4, 0, 6, 7, 8, 3, 1, 2, 9, 0]

    pull(
      values(numbers),
      unique(),
      collect((err, ary) => {
        expect(err).to.equal(null)
        expect(ary.sort()).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        done()
      })
    )
  })

  it('iteratee', done => {
    const numbers = [0.1, 0.6, 1.1, 1.6]

    pull(
      values(numbers),
      unique(Math.floor),
      collect((err, ary) => {
        expect(err).to.equal(null)
        expect(ary.sort()).to.deep.equal([0.1, 1.1])
        done()
      })
    )
  })
})
