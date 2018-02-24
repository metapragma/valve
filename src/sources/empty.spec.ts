import { collect, empty, pull } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/empty', () => {
  it('...', done => {
    pull(
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
