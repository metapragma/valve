/* tslint:disable no-console */

// const array = require('../smallArray')
const pull = require('pull-stream')
// const array = requre('../smallArray')

const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const stream = pull(
  pull.values(array),
  pull.take(n => n > 5),
  pull.collect((err, ary) => {
    console.log('completed')
  })
)
