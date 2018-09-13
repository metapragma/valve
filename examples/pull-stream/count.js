/* tslint:disable no-console */

// const array = require('../smallArray')
const pull = require('pull-stream')

const stream = pull(
  pull.count(100),
  pull.collect((err, ary) => {
    console.log('completed')
  })
)
