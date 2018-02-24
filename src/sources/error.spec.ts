import { collect, error, pull } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/error', () => {
  it('...', done => {
    const ee = new Error('Some error')

    pull(
      error(ee),
      collect({
        onError(action) {
          assert.equal(action.payload, ee)
          done()
        }
      })
    )
  })
})
