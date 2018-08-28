/* tslint:disable no-console */

const {
  drain,
  filter,
  fromArray,
  map,
  reduce,
  valve
} = require('../lib/cjs/index.js')
const { inspect } = require('util')
const { range, noop } = require('lodash')

const array = range(parseInt(process.argv.slice(2)[0], 10))

const compose = valve()

const stream = compose(
  fromArray(array),
  // filter(x => x % 2 === 0),
  // map(i => i + 1),
  drain()
  // reduce((x, y) => x + y, 0)
)

stream.subscribe({
  next: console.log,
  complete() {
    console.log('done')
  }
})

stream.schedule()
