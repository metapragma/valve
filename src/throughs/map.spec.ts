import { collect, fromIterable, map, pull } from '../index'

import { createSink } from '../utilities'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('throughs/map', () => {
  it('...', done => {
    pull(
      fromIterable([1, 2, 3, 4, 5, 6]),
      map(n => {
        return n + 1
      }),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [2, 3, 4, 5, 6, 7])
          done()
        }
      })
    )
  })

  it('error', () => {
    const err = new Error('unwholesome number')

    const sink = createSink({
      // onError (action) {
      //   assert.deepEqual(action.payload, err)
      //   // done()
      // }
    })

    // TODO: try/catch?

    assert.throws(
      () =>
        pull(
          fromIterable([1, 2, 3, 3.4, 4]),
          map(e => {
            // tslint:disable-next-line no-bitwise
            if (e !== ~~e) throw err

            return e
          }),
          sink
        ),
      /unwholesome number/
    )
  })
})
