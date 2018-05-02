import { collect, count, infinite, take, through, valve } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'
import { spy } from 'sinon'

describe('throughs/through', () => {
  it('...', done => {
    const s = spy()

    valve(
      count(5),
      through({
        onData() {
          s()
        }
      }),
      collect({
        onData(action) {
          assert.equal(s.callCount, 5)
          assert.deepEqual(action.payload, [1, 2, 3, 4, 5])
          done()
        }
      })
    )
  })

  it('onEnd', done => {
    valve(
      infinite(),
      through({
        onAbort() {
          setImmediate(() => {
            done()
          })
        }
      }),
      take(10),
      collect({
        onData(action) {
          assert.equal(action.payload.length, 10)
        }
      })
    )
  })
})
