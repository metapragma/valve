/* tslint:disable no-increment-decrement ban-comma-operator */
import {
  log,
  map,
  pull,
  reduce,
  through,
  values
} from '../index'

import tape = require('tape')

import {
  StreamSink,
  StreamSource
} from '../types'

// function curry <P, E>(fun) {
//   // tslint:disable-next-line no-function-expression
//   return function (): StreamSink<P, E> {
//     const args = [].slice.call(arguments)

//     return read => {
//       return fun.apply(null, [read].concat(args))
//     }
//   }
// }

// function values <P, E> (array: P[]): StreamSource<P, E> {
//   let i = 0

//   return (abort, cb) => {
//     if (abort) {
//       (i = array.length), cb(abort)
//     } else if (i >= array.length) {
//       cb(true)
//     } else {
//       cb(null, array[i++])
//     }
//   }
// }

// const map = curry((read, mapper) => {
//   return (abort, cb) => {
//     read(abort, (end, data) => {
//       if (end) cb(end)
//       else cb(null, mapper(data))
//     })
//   }
// })

// var sum = curry(function(read, done) {
//   var total = 0
//   read(null, function next(end, data) {
//     if (end) return done(end === true ? null : end, total)
//     total += data
//     read(null, next)
//   })
// })

// var log = curry(function(read) {
//   return function(abort, cb) {
//     read(abort, function(end, data) {
//       if (end) return cb(end)
//       console.error(data)
//       cb(null, data)
//     })
//   }
// })

tape('wrap pull streams into stream', t => {
  pull(
    values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    map(e => {
      return e * e
    }),
    through(
      data => console.log(data)
    ),
    reduce(
      (acc, data) => {
        return acc + data
      },
      (err, value) => {
        t.notOk(err)
        t.equal(value, 385)
        t.end()
      }
    )
  )
})

tape('turn pull(through,...) -> Through', t => {
  pull(
    values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    pull<number, number, number, Error>(
      map((e: number) => {
        return e * e
      }),
      through(
        data => console.log(data)
      )
    ),
    reduce(
      (acc: number, data: number) => {
        return acc + data
      },
      (err, value) => {
        t.notOk(err)
        t.equal(value, 385)
        t.end()
      }
    )
  )
})

//  pull(
//    values ([1 2 3 4 5 6 7 8 9 10])
//    pull(
//      map({x y;: e*e })
//      log()
//    )
//    sum({
//      err value:
//        t.equal(value 385)
//        t.end()
//      })
//  )
//

tape('writable pull() should throw when called twice', t => {
  t.plan(2)

  const stream: StreamSink<number, Error> = pull<number, number, Error>(
    map((e: number) => {
      return e * e
    }),
    reduce(
      (acc: number, data: number) => {
        return acc + data
      },
      (_, value) => {
        t.equal(value, 385)
      }
    )
  )

  stream(values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))

  t.throws(() =>{
    stream(values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
  }, TypeError)
})
