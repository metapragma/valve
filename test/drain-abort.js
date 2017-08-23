import { pull, drain as pullDrain, infinite, asyncMap } from '../index'

const tape = require('tape')

tape('abort on drain', function(t) {
  var c = 100
  var drain = pullDrain(
    function() {
      if (c < 0) throw new Error('stream should have aborted')
      if (!--c) return false //drain.abort()
    },
    function() {
      t.end()
    }
  )

  pull(infinite(), drain)
})

function delay() {
  return asyncMap(function(e, cb) {
    setTimeout(function() {
      cb(null, e)
    })
  })
}

tape('abort on drain - async', function(t) {
  var c = 100
  var drain = pullDrain(
    function() {
      if (c < 0) throw new Error('stream should have aborted')
      if (!--c) return drain.abort()
    },
    function() {
      t.end()
    }
  )

  pull(infinite(), delay(), drain)
})

tape('abort on drain - sync', function(t) {
  var c = 100
  var drain = pullDrain(
    function() {
      if (c < 0) throw new Error('stream should have aborted')
      if (!--c) return drain.abort()
    },
    function() {
      t.end()
    }
  )

  pull(infinite(), drain)
})

tape('abort on drain - async, out of cb', function(t) {
  var c = 0,
    ERR = new Error('test ABORT')
  var drain = pullDrain(
    function() {
      --c
    },
    function(err) {
      t.ok(c < 0)
      t.equal(err, ERR)
      t.end()
    }
  )

  pull(infinite(), delay(), drain)

  setTimeout(function() {
    drain.abort(ERR)
  }, 100)
})
