import { collect, infinite, take, valve } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/infinite', () => {
  it('default', done => {
    valve(
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
    valve(
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
