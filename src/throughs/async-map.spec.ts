import {
  asyncMap,
  collect,
  count,
  fromIterable,
  infinite,
  pull,
  take,
  through
} from '../index'

import { ValveActionType, ValveSource, ValveType } from '../types'

import { hasEnded } from '../utilities'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'
import { spy } from 'sinon'

// tslint:disable-next-line
import immediate = require('immediate')

function delay(ms: number) {
  return asyncMap<number, number>(
    (e: number) =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(e + 1)
        }, ms)
      })
  )
}

describe('throughs/async-map', () => {
  it('...', done => {
    pull(
      count(),
      take(21),
      delay(50),
      collect({
        onData(action) {
          assert.equal(action.payload.length, 21)
          done()
        }
      })
    )
  })

  it('...', done => {
    pull(
      count(),
      take(21),
      asyncMap(data => Promise.resolve(data + 1)),
      collect({
        onData(action) {
          assert.equal(action.payload.length, 21)
          done()
        }
      })
    )
  })

  it('...', done => {
    pull(
      fromIterable([1, 2, 3]),
      asyncMap(data => Promise.resolve(data + 1)),
      collect({
        onData(action) {
          assert.deepEqual(action.payload, [2, 3, 4])
          done()
        }
      })
    )
  })

  it('abort', done => {
    const err = new Error('err')
    const s = spy()

    const read = pull(infinite(), asyncMap(data => Promise.resolve(data)))

    read.source({ type: ValveActionType.Pull }, action => {
      s()

      if (action.type === ValveActionType.Error) {
        assert.equal(action.payload, err)
      } else {
        done(new Error('expected read to end'))
      }
    })

    read.source({ type: ValveActionType.Error, payload: err }, action => {
      if (action.type === ValveActionType.Error) {
        assert.equal(action.payload, err)
        assert.equal(s.callCount, 1)
        done()
      } else {
        done(new Error('expected read to end'))
      }
    })
  })

  it('abort async source', done => {
    const err = new Error('abort')
    const s = spy()

    const source: ValveSource<string> = {
      type: ValveType.Source,
      source(action, cb) {
        immediate(() => {
          if (hasEnded(action)) {
            cb({ type: ValveActionType.Error, payload: err })
          } else {
            cb({
              type: ValveActionType.Data,
              payload: 'x'
            })
          }
        })
      }
    }

    const read = pull(
      source,
      asyncMap(
        data =>
          new Promise(resolve => {
            immediate(() => {
              resolve(data)
            })
          })
      )
    )

    read.source({ type: ValveActionType.Pull }, action => {
      s()
      if (action.type === ValveActionType.Error) {
        assert.equal(action.payload, err)
      } else {
        done(new Error('expected read to end'))
      }
    })

    read.source({ type: ValveActionType.Error, payload: err }, action => {
      if (action.type === ValveActionType.Error) {
        assert.equal(action.payload, err)
        assert.equal(s.callCount, 1)
        done()
      } else {
        done(new Error('expected read to end'))
      }
    })
  })

  it('abort on error', done => {
    const ERR = new Error('abort')

    pull(
      pull(
        fromIterable([1, 2, 3]),
        through({
          onError(action) {
            assert.equal(action.payload, ERR)
            done()
          }
        })
      ),
      asyncMap(() => Promise.reject(ERR)),
      collect({
        onError(action) {
          assert.equal(action.payload, ERR)
        }
      })
    )
  })
})
