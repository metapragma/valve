import {
  pull,
  reduce,
  values
} from '../index'

const test = require('tape')

test('reduce becomes through', function (t) {
  pull(
    values([1,2,3]),
    reduce(function (a, b) {return a + b}, function (err, val) {
      t.equal(val, 6)
      t.end()
    }, 0)
  )
})

test('reduce without initial value', function (t) {
  pull(
    values([1,2,3]),
    reduce(function (a, b) {return a + b}, function (err, val) {
      t.equal(val, 6)
      t.end()
    })
  )
})


test('reduce becomes drain', function (t) {
  pull(
    values([1,2,3]),
    reduce(
      function (a, b) {return a + b},
      function (err, acc) {
        t.equal(acc, 6)
        t.end()
      },
      0
    )
  )
})


