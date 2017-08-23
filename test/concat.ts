import {
  concat,
  pull,
  through,
  values
} from '../index'

import test = require('tape')

test('concat', t => {
  let n = 0

  pull(
    values('hello there this is a test'.split(/([aeiou])/)),
    through(() => {
      // tslint:disable-next-line no-increment-decrement
      n++
    }),
    concat((_, mess) => {
      t.equal(mess, 'hello there this is a test')
      t.equal(n, 17)
      t.end()
    })
  )
})
