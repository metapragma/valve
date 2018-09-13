/* tslint:disable no-console */

// const array = require('../smallArray')
const pull = require('pull-stream')

const stream = pull(
  pull.empty(),
  pull.collect((err, ary) => {
    console.log('completed')
  })
)
