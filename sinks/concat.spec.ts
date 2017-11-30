import {
  concat,
  pull,
  through,
  values
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai';

describe('sinks/concat', () => {
  it('...', done => {
    let n = 0

    pull(
      values('hello there this is a test'.split(/([aeiou])/)),
      through(() => {
        // tslint:disable-next-line no-increment-decrement
        n++
      }),
      concat((_, mess) => {
        expect(mess).to.equal('hello there this is a test')
        expect(n).to.equal(17)
        done()
      })
    )
  })
})
