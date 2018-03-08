import { collect, empty, valve } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/empty', () => {
  it('...', done => {
    valve(
      empty(),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [])
          done()
        }
      })
    )
  })
})
