import { collect, filterNot, infinite, map, pull, take } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('throughs/filter-not', () => {
  it('random', done => {
    pull(
      infinite(),
      filterNot(d => {
        return d > 0.5
      }),
      take(100),
      collect({
        onData(action) {
          assert.equal(action.payload.length, 100)

          action.payload.forEach(d => {
            assert.equal(d < 0.5, true)
            assert.equal(d <= 1, true)
          })

          done()
        }
      })
    )
  })

  it('regexp', done => {
    pull(
      infinite(),
      map(d => {
        return Math.round(d * 1000).toString(16)
      }),
      filterNot(n => /^[^e]+$/i.test(n)), // no E
      take(37),
      collect({
        onData(action) {
          assert.equal(action.payload.length, 37)
          action.payload.forEach(d => {
            assert.include(d, 'e')
          })

          done()
        }
      })
    )
  })
})
