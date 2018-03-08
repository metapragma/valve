import { collect, count, empty, valve } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('sinks/collect', () => {
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

  it('...', done => {
    valve(
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
