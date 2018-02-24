import { collect, count, map, pull, through } from './index'

import { ValveActionType } from './types'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

import { spy } from 'sinon'

describe('continuable', () => {
  it('continuable stream', done => {
    // With values:
    const sA = spy()
    const sB = spy()
    const sC = spy()

    const stream = pull(
      count(5),
      map(item => {
        sA()

        return item * 2
      }),
      through()
    )

    stream.source({ type: ValveActionType.Pull }, action => {
      sB()

      if (action.type === ValveActionType.Data) {
        assert.equal(action.payload, 2)
      } else {
        done(new Error('Action type mismatch'))
      }
    })

    stream.source({ type: ValveActionType.Pull }, action => {
      sC()

      if (action.type === ValveActionType.Data) {
        assert.equal(action.payload, 4)
      } else {
        done(new Error('Action type mismatch'))
      }
    })

    pull(
      stream,
      collect({
        onData(action) {
          assert.equal(sA.callCount, 5)
          assert.equal(sB.callCount, 1)
          assert.equal(sC.callCount, 1)
          assert.deepEqual(action.payload, [6, 8, 10])
          done()
        }
      })
    )
  })

  // it('continuable stream (error)', done => {
  //   const ERR = new Error('test')
  //
  //   const stream = pull(error(ERR), through(noop))
  //
  //   stream.source(false, (err, data) => {
  //     expect(err).to.equal(ERR)
  //     expect(data).to.equal(undefined)
  //   })
  //
  //   stream.source(false, (err, data) => {
  //     expect(err).to.equal(ERR)
  //     expect(data).to.equal(undefined)
  //     done()
  //   })
  // })
})
