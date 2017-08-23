import {
  collect,
  infinite,
  pull,
  take,
  through
} from '../index'

const tape = require('tape')

tape('through - onEnd', function (t) {
  t.plan(2)
  pull(
    infinite(),
    through(null, function (err) {
      console.log('end')
      t.ok(true)
      process.nextTick(function () {
        t.end()
      })
    }),
    take(10),
    collect(function (err, ary) {
      console.log(ary)
      t.ok(true)
    })
  )
})
