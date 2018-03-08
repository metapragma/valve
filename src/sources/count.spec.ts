import { collect, count, valve } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/count', () => {
  it('...', done => {
    valve(
      count(5),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3, 4, 5])
          done()
        }
      })
    )
  })
})
