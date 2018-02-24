import { concat, pull, through, values } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sinks/concat', () => {
  it('...', done => {
    let n = 0

    pull(
      values('hello there this is a test'.split(/([aeiou])/)),
      through({
        onData() {
          // tslint:disable-next-line no-increment-decrement
          n++
        }
      }),
      concat({
        onData(action) {
          assert.deepEqual(action.payload, 'hello there this is a test')
          assert.equal(n, 17)
          done()
        }
      })
    )
  })
})
