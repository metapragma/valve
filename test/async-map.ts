import {
  asyncMap,
  collect,
  count,
  infinite,
  pull,
  take,
  values
} from '../index'

import tape = require('tape')

import {
  StreamAbort,
  StreamCallback
} from '../types'

tape('async-map', t => {
  pull(
    count(),
    take(21),
    asyncMap((data, cb) => {
      return cb(null, data + 1)
    }),
    collect((_, ary) => {
      // console.log(ary)
      t.equal(ary.length, 21)
      t.end()
    })
  )
})

tape('abort async map', t => {
  const err = new Error('abort')
  t.plan(2)

  const read = pull(
    infinite(),
    asyncMap((data, cb) => {
      setImmediate(() => {
        cb(null, data)
      })
    })
  )

  read(null, end => {
    if(!end) throw new Error('expected read to end')
    t.ok(end, "read's callback")
  })

  read(err, end => {
    if(!end) throw new Error('expected abort to end')
    t.ok(end, "Abort's callback")
    t.end()
  })

})

tape('abort async map (async source)', t => {
  const err = new Error('abort')
  t.plan(2)

  const read = pull(
    // tslint:disable-next-line no-shadowed-variable
    (_: StreamAbort<Error>, cb: StreamCallback<string, Error>) => {
      setImmediate(() => {
        if (err) return cb(err)
        cb(null, 'x')
      })
    },
    asyncMap((data, cb) => {
      setImmediate(() => {
        cb(null, data)
      })
    })
  )

  read(null, end => {
    if(!end) throw new Error('expected read to end')
    t.ok(end, "read's callback")
  })

  read(err, end => {
    if(!end) throw new Error('expected abort to end')
    t.ok(end, "Abort's callback")
    t.end()
  })

})

tape('asyncMap aborts when map errors', t => {
  t.plan(2)

  const ERR = new Error('abort')

  pull(
    values<number, Error>([1,2,3], err => {
      // console.log('on abort')
      t.equal(err, ERR, 'abort gets error')
      t.end()
    }),
    asyncMap((_, cb) => {
      cb(ERR)
    }),
    collect(err => {
      t.equal(err, ERR, 'collect gets error')
    })
  )
})
