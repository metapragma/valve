import {
  collect,
  filter,
  filterNot,
  infinite,
  map,
  pull,
  take
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

describe('throughs/filter', () => {
  it('random', done => {
    pull(
      infinite(),
      filter(d => {
        return d > 0.5
      }),
      take(100),
      collect((_, array) => {
        expect(array.length).to.equal(100)

        array.forEach(d => {
          expect(d > 0.5).to.equal(true)
          expect(d <= 1).to.equal(true)
        })

        done()
      })
    )
  })

  it('regexp', done => {
    pull(
      infinite(),
      map(d => {
        return Math.round(d * 1000).toString(16)
      }),
      filter(/^[^e]+$/i), // no E
      take(37),
      collect((_, array) => {
        expect(array.length).to.equal(37)
        array.forEach(d => {
          expect(d).to.not.contain('e')
        })

        done()
      })
    )
  })
})
