import {
  collect,
  nonUnique,
  pull,
  unique,
  values
} from '../index'

import test = require('tape')

test('unique', t => {
  const numbers = [1, 2, 2, 3, 4, 5, 6, 4, 0, 6, 7, 8, 3, 1, 2, 9, 0]

  pull(
    values(numbers),
    unique(),
    collect((err, ary) => {
      t.notOk(err)
      t.deepEqual(ary.sort(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      t.end()
    })
  )
})

test('non-unique', t => {
  const numbers = [1, 2, 2, 3, 4, 5, 6, 4, 0, 6, 7, 8, 3, 1, 2, 9, 0]

  pull(
    values(numbers),
    nonUnique(),
    collect((err, ary) => {
      t.notOk(err)
      t.deepEqual(ary.sort(), [0, 1, 2, 2, 3, 4, 6])
      t.end()
    })
  )
})
