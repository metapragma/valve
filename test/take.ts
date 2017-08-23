/* tslint:disable no-console no-increment-decrement*/

import { collect, pull, take, through, values } from '../index'

import {
  StreamAbort,
  StreamCallback,
  StreamSource
} from '../types'

import test = require('tape')

test('through - onEnd', t => {
  t.plan(2)
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  // read values, and then just stop!
  // this is a subtle edge case for take!

  // I did have a thing that used this edge case,
  // but it broke take, actually. so removing it.
  // TODO: fix that thing - was a test for some level-db stream thing....

  //   Source(function () {
  //     return function (end, cb) {
  //       if(end) cb(end)
  //       else if(values.length)
  //         cb(null, values.shift())
  //       else console.log('drop')
  //     }
  //   })()

  pull(
    values(data),
    take(10),
    through(null, _ => {
      console.log('end')
      t.ok(true)
      process.nextTick(() => {
        t.end()
      })
    }),
    collect((_, ary) => {
      console.log(ary)
      t.ok(true)
    })
  )
})

test('take - exclude last (default)', t => {
  pull(
    values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    take(n => {
      return n < 5
    }),
    collect((_, four) => {
      t.deepEqual(four, [1, 2, 3, 4])
      t.end()
    })
  )
})
test('take - include last', t => {
  pull(
    values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    take(
      n => {
        return n < 5
      },
      { last: true }
    ),
    collect((_, five) => {
      t.deepEqual(five, [1, 2, 3, 4, 5])
      t.end()
    })
  )
})

test('take 5 causes 5 reads upstream', t => {
  let reads = 0

  pull(
    values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    <P, E>(read: StreamSource<number, E>) => {
      return (end: StreamAbort<E>, cb: StreamCallback<number, E>) => {
        if (end !== true) reads++
        console.log(reads, end)
        read(end, cb)
      }
    },
    take(5),
    collect((_, five) => {
      t.deepEqual(five, [1, 2, 3, 4, 5])
      process.nextTick(() => {
        t.equal(reads, 5)
        t.end()
      })
    })
  )
})

test("take doesn't abort until the last read", t => {
  const ary = [1, 2, 3, 4, 5]
  let aborted = false
  let i = 0

  const read = pull(
    (abort: StreamAbort<Error>, cb: StreamCallback<number, Error>) => {
      if (abort) cb((aborted = true))
      else if (i > ary.length) cb(true)
      else cb(null, ary[i++])
    },
    take(
      d => {
        return d < 3
      },
      { last: true }
    )
  )

  read(null, (_, __) => {
    t.notOk(aborted, "hasn't aborted yet")
    read(null, (_, __) => {
      t.notOk(aborted, "hasn't aborted yet")
      read(null, (_, __) => {
        t.notOk(aborted, "hasn't aborted yet")
        read(null, (end, d) => {
          t.ok(end, 'stream ended')
          t.equal(d, undefined, 'data undefined')
          t.ok(aborted, 'has aborted by now')
          t.end()
        })
      })
    })
  })
})
