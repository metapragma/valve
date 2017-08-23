import {
  collect,
  filter,
  filterNot,
  infinite,
  map,
  pull,
  take
} from '../index'

import test = require('tape')

test('filtered randomnes', t => {
  pull(
    infinite(),
    filter(d => {
      // console.log('f', d)
      return d > 0.5
    }),
    take(100),
    collect((_, array) => {
      t.equal(array.length, 100)

      array.forEach(d => {
        t.ok(d > 0.5)
        t.ok(d <= 1)
      })

      t.end()
    })
  )
})

test('filter with regexp', t => {
  pull(
    infinite(),
    map(d => {
      return Math.round(d * 1000).toString(16)
    }),
    filter(/^[^e]+$/i), // no E
    take(37),
    collect((_, array) => {
      t.equal(array.length, 37)
      array.forEach(d => {
        t.equal(d.indexOf('e'), -1)
      })
      t.end()
    })
  )
})

test('inverse filter with regexp', t => {
  pull(
    infinite(),
    map(d => {
      return Math.round(d * 1000).toString(16)
    }),
    filterNot(/^[^e]+$/i), // no E
    take(37),
    collect((_, array) => {
      t.equal(array.length, 37)
      array.forEach(d => {
        t.notEqual(d.indexOf('e'), -1)
      })
      t.end()
    })
  )
})
