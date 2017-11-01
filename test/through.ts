import {
  collect,
  infinite,
  pull,
  take,
  through
} from '../index'

import tape = require('tape')

tape('through - onEnd', t => {
  t.plan(4)

  pull(
    infinite(),
    through(null, err => {
      t.notOk(err)
      // console.log('end')

      t.ok(true)

      process.nextTick(() =>{
        t.end()
      })
    }),
    take(10),
    collect((err, _) => {
      t.notOk(err)
      // console.log(ary)
      t.ok(true)
    })
  )
})
