/* tslint:disable no-console */

// const array = require('../smallArray')
const pull = require('pull-stream')

const stream = pull(
  pull.infinite(),
  pull.take(100),
  pull.map(x => x * x),
  pull.collect((err, ary) => {
    console.log('completed')
  })
)
