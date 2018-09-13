/* tslint:disable no-console */

// const array = require('../smallArray')
const pull = require('pull-stream')

const stream = pull(
  pull.once({ a: 1, b: 2, c: 3}),
  pull.collect((err, ary) => {
    console.log('completed')
  })
)
