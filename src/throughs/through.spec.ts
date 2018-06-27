import { collect, count, error, infinite, take, through, valve } from '../index'
import { ValveActionType } from '../types'

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
        onData(action) {
          assert.isNumber(action.payload)
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
        onAbort(action) {
          assert.isOk(action.type === ValveActionType.Abort)
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

  it('error', done => {
    const s = spy()
    const err = new Error('bla')

    valve(
      error(err),
      through({
        onError() {
          s()
        }
      }),
      collect({
        onError(action) {
          assert.equal(s.callCount, 1)
          assert.deepEqual(action.payload, err)
          done()
        }
      })
    )
  })
})
