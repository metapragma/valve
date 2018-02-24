import { collect, count, empty, pull } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sinks/collect', () => {
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

  it('...', done => {
    pull(
      count(3),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [1, 2, 3])

          done()
        }
      })
    )
  })
})
