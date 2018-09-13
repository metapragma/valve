/* tslint:disable no-console */

// const array = require('../smallArray')
const pull = require('pull-stream')

const stream = pull(
  pull.infinite(),
  pull.filterNot((x) => {
    return x > 0.5
  }),
  pull.take(100),
  pull.collect((err, array) => {
    console.log(array)
  })
)
