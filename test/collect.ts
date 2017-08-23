import {
  collect,
  empty,
  pull
} from '../index'

import test = require('tape')

test('collect empty', t => {
  pull<void>(
    empty(),
    collect((err, ary) => {
      t.notOk(err)
      t.deepEqual(ary, [])
      t.end()
    })
  )
})
