import { collect, count, infinite, pull, take, through } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'
import { spy } from 'sinon'

// tslint:disable-next-line
import immediate = require('immediate')

describe('throughs/through', () => {
  it('...', done => {
    const s = spy()

    pull(
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
    pull(
      infinite(),
      through({
        onAbort() {
          immediate(() => {
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
