/* tslint:disable no-console */

import {
  Through,
  fromIterable,
  concat,
  valve
} from '../../src/index'

// let n = 0

const stream = valve()(
  fromIterable('hello there this is a test'.split(/([aeiou])/)),
  Through.create(({ next }) => ({
    next(str) {
      // tslint:disable-next-line no-increment-decrement
      // n++

      next(str)
    }
  })),
  concat()
)

stream.subscribe({
  next(value) {
    console.log(value)
  },
  complete() {
    console.log('completed')
  }
})

stream.schedule()