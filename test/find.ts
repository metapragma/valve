import {
  asyncMap,
  find,
  pull,
  values
} from '../index'

import test = require('tape')

test('find 7', t => {
  pull(
    values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    find(
      (err, seven) => {
        t.equal(seven, 7)
        t.notOk(err)
        t.end()
      },
      d => {
        return d === 7
      }
    )
  )
})

// tslint:disable-next-line insecure-random
const target = Math.random()

test(`find ${target}`, t => {
  // tslint:disable-next-line insecure-random
  const f = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(Math.random)

  f.push(target)
  pull(
    values(f.sort()),
    find(
      (err, found) => {
        t.equal(found, target)
        t.notOk(err)
        t.end()
      },
      d => {
        return d === target
      }
    )
  )
})

test('find missing', t => {
  const f = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  pull(
    values(f.sort()),
    find(
      (err, found) => {
        t.equal(found, null)
        t.notOk(err)
        t.end()
      },
      d => {
        return d === target
      }
    )
  )
})

test('there can only be one', t => {
  pull(
    values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    asyncMap((e, cb) => {
      process.nextTick(() => {
        cb(null, e)
      })
    }),
    find(
      (err, seven) => {
        t.equal(seven, 7)
        t.notOk(err)
        t.end()
      },
      d => {
        return d >= 7
      }
    )
  )
})

test('find null', t => {
  pull(
    values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    find((err, first) => {
      t.equal(first, 1)
      t.notOk(err)
      t.end()
    }, null)
  )
})
