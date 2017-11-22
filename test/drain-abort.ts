/* tslint:disable no-increment-decrement */

import {
  asyncMap,
  drain as pullDrain,
  infinite,
  pull
} from '../index'

import {
  IStreamSink
} from '../types'

import tape = require('tape')

tape('abort on drain', t => {
  let c = 100
  const drain = pullDrain(
    () => {
      if (c < 0) throw new Error('stream should have aborted')
      if (!--c) return false // drain.abort()
    },
    () => {
      t.end()
    }
  )

  pull(infinite(), drain)
})

function delay () {
  return asyncMap((e, cb) => {
    setTimeout(() => {
      cb(null, e)
    }, 1)
  })
}

tape('abort on drain - async', t => {
  let c = 100
  const drain: IStreamSink<{}, Error> = pullDrain(
    () => {
      if (c < 0) throw new Error('stream should have aborted')
      if (!--c) return drain.sink.abort()
    },
    () => {
      t.end()
    }
  )

  pull(infinite(), delay(), drain)
})

tape('abort on drain - sync', t => {
  let c = 100
  const drain: IStreamSink<{}, Error> = pullDrain(
    () => {
      if (c < 0) throw new Error('stream should have aborted')
      if (!--c) return drain.sink.abort()
    },
    () => {
      t.end()
    }
  )

  pull(infinite(), drain)
})

tape('abort on drain - async, out of cb', t => {
  let c = 0
  const ERR = new Error('test ABORT')

  const drain = pullDrain(
    () => {
      --c
    },
    err => {
      t.ok(c < 0)
      t.equal(err, ERR)
      t.end()
    }
  )

  pull(infinite(), delay(), drain)

  setTimeout(() => {
    drain.sink.abort(ERR)
  }, 100)
})
