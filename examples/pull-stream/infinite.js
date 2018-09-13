/* tslint:disable no-console */

// const array = require('../smallArray')
const pull = require('pull-stream')

const stream = pull(
  pull.infinite(),
  pull.take(10000),
  pull.collect((err, ary) => {
    console.log('completed')
  })
)
