/* tslint:disable no-console */

const { 
  random, 
  range 
} = require('lodash')

const pull = require('pull-stream')

const array = range(random(100, 150))

const stream = pull(
  pull.values(array),
  pull.reduce((x, y) => x + y, 0, (_, i) => {
    console.log(i)
    console.log('completed')
  })
)
