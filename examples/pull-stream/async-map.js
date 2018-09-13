/* tslint:disable no-console */

// const array = require('../smallArray')
const pull = require('pull-stream')

const stream = pull(
  pull.count(),
  pull.take(100),
  pull.asyncMap((data, cb) => {
    return cb(null, data + 1)
  }),
  pull.collect(function (err, ary) {
    console.log('completed')
  })
)