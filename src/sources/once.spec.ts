import { collect, once, valve } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sources/once', () => {
  it('...', done => {
    valve(
      once({ a: 1, b: 2, c: 3 }),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [{ a: 1, b: 2, c: 3 }])
          done()
        }
      })
    )
  })
})
