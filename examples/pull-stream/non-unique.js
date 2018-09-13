/* tslint:disable no-console */

const { 
  random, 
  range 
} = require('lodash')

const pull = require('pull-stream')

const array = range(random(100, 150))

const stream = pull(
  pull.values(array),
  pull.nonUnique()
)

console.log(stream)
console.log('completed')