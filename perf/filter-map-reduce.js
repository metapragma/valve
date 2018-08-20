/* tslint:disable no-console */

const memwatch = require('@airbnb/node-memwatch')
const {
  filter,
  fromArray,
  map,
  reduce,
  valve
} = require('../lib/cjs/index.js')
const { inspect } = require('util')
const { range, noop } = require('lodash')

const array = range(parseInt(process.argv.slice(2)[0], 10))

memwatch.gc()

const hd = new memwatch.HeapDiff()

const compose = valve()

const stream = compose(
  fromArray(array),
  filter(x => x % 2 === 0),
  map(i => i + 1),
  reduce((x, y) => x + y, 0)
)

stream.subscribe({
  next: noop,
  complete() {
    const diff = hd.end()

    console.log(JSON.stringify(diff, null, 2))
  }
})

stream.schedule()

memwatch.on('leak', d => {
  console.error('LEAK:', d)

  process.exit(1)
})

// memwatch.on('stats', stats => {
//   console.log(stats)
// })
