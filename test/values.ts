import {
  collect,
  keys,
  pull,
  values
} from '../index'

import tape = require('tape')

tape('values - array', t => {
  pull<number>(
    values([1, 2, 3]),
    collect((err, ary) => {
      t.notOk(err)
      t.deepEqual(ary, [1, 2, 3])
      t.end()
    })
  )
})

tape('values - object', t => {
  const obj = { a: 1, b: 2, c: 3 }

  pull<number>(
    values(obj),
    collect((err, ary) => {
      t.notOk(err)
      t.deepEqual(ary, [1, 2, 3])
      t.end()
    })
  )
})

tape('keys - object', t => {
  const obj = { a: 1, b: 2, c: 3 }

  pull<string>(
    keys(obj),
    collect((err, ary) => {
      t.notOk(err)
      t.deepEqual(ary, ['a', 'b', 'c'])
      t.end()
    })
  )
})

tape('values, abort', t => {
  t.plan(3)

  const err = new Error('intentional')

  const read = values([1, 2, 3], _ => {
    t.end()
  })

  read(null, (_, one) => {
    t.notOk(_)
    t.equal(one, 1)

    read(err, _err => {
      t.equal(_err, err)
    })
  })
})
