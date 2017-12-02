/* tslint:disable no-increment-decrement ban-comma-operator */
import {
  log,
  map,
  pull,
  reduce,
  through,
  values
} from './index'

import {
  noop
} from 'lodash'

import {
  ValveSinkFunction,
  ValveSourceFunction
} from './types'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai';

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

describe('pull', () => {
  it('wrap pull streams into stream', done => {
    pull(
      values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      map(e => {
        return e * e
      }),
      through(
        noop
      ),
      reduce(
        (acc, data) => {
          return acc + data
        },
        (err, value) => {
          expect(err).to.equal(null)
          expect(value).to.equal(385)
          done()
        }
      )
    )
  })

  it('turn pull(through,...) -> Through', done => {
    pull(
      values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      pull(
        map((e: number) => {
          return e * e
        }),
        through(
          noop
        )
      ),
      reduce(
        (acc: number, data: number) => {
          return acc + data
        },
        (err, value) => {
          expect(err).to.equal(null)
          expect(value).to.equal(385)
          done()
        }
      )
    )
  })

  it('writable pull() should throw when called twice', () => {
    const stream = pull(
      map((e: number) => {
        return e * e
      }),
      reduce(
        (acc: number, data: number) => {
          return acc + data
        },
        (_, value) => {
          expect(value).to.equal(385)
        }
      )
    )

    stream.sink(values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))

    expect(() =>{
      stream.sink(values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
    }).to.throw(TypeError)
  })
})
