import {
  collect,
  empty,
  error,
  filter,
  infinite,
  map,
  pull,
  take
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('throughs/filter', () => {
  it('random', done => {
    pull(
      infinite(),
      filter(d => {
        return d > 0.5
      }),
      take(100),
      collect({
        onData(action) {
          assert.equal(action.payload.length, 100)

          action.payload.forEach(d => {
            assert.isOk(d > 0.5)
            assert.isOk(d <= 1)
          })

          done()
        }
      })
    )
  })

  it('regexp', done => {
    pull(
      infinite(),
      map(d => {
        return Math.round(d * 1000).toString(16)
      }),
      filter(n => /^[^e]+$/i.test(n)), // no E
      take(37),
      collect({
        onData(action) {
          assert.equal(action.payload.length, 37)
          action.payload.forEach(d => {
            assert.notInclude(d, 'e')
          })

          done()
        }
      })
    )
  })

  it('empty', done => {
    pull(
      empty(),
      filter(() => {
        return false
      }),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [])
          done()
        }
      })
    )
  })

  it('error', done => {
    const err = new Error('qwe')
    pull(
      error(err),
      filter(() => {
        return false
      }),
      collect({
        onError(action) {
          assert.equal(action.payload, err)
          done()
        }
      })
    )
  })
})
