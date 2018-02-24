import { collect, infinite, pull, take } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/infinite', () => {
  it('default', done => {
    pull(
      infinite(),
      take(5),
      collect({
        onData(action) {
          assert.equal(action.payload.length, 5)
          done()
        }
      })
    )
  })

  it('custom', done => {
    pull(
      infinite(() => 1),
      take(5),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 1, 1, 1, 1])
          done()
        }
      })
    )
  })
})
