const pull = require('pull-stream')

var c = 100
var drain = pull.drain(function () {
  if(c < 0) throw new Error('stream should have aborted')
  if(!--c) return false //drain.abort()
}, function () {
  console.log('stream is drained')
})

pull(pull.infinite(), drain)