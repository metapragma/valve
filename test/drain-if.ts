import {
  pull,
  reduce,
  values
} from '../index'

import test = require('tape')

test('reduce becomes through', t => {
  pull(
    values([1, 2, 3]),
    reduce(
      (a, b) => {
        return a + b
      },
      (err, val) => {
        t.notOk(err)
        t.equal(val, 6)
        t.end()
      },
      0
    )
  )
})

test('reduce without initial value', t => {
  pull(
    values([1, 2, 3]),
    reduce(
      (a, b) => {
        return a + b
      },
      (err, val) => {
        t.notOk(err)
        t.equal(val, 6)
        t.end()
    })
  )
})


test('reduce becomes drain', t => {
  pull(
    values([1, 2, 3]),
    reduce(
      (a, b) => {
        return a + b
      },
      (err, acc) => {
        t.notOk(err)
        t.equal(acc, 6)
        t.end()
      },
      0
    )
  )
})
