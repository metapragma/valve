const pull = require('pull-stream')

pull(
  pull.values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  pull.find(function (d) {
    return d == 7
  }, function (err, seven) {
    console.log(seven)
    console.log('completed')
  })
)