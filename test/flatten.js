import {
  collect,
  error,
  flatten,
  onEnd,
  pull,
  take,
  through,
  values
} from '../index'

const test = require('tape')

test('flatten arrays', function(t) {
  pull(
    values([[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
    flatten(),
    collect(function(err, numbers) {
      t.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9], numbers)
      t.end()
    })
  )
})

test('flatten - number of reads', function(t) {
  var reads = 0
  pull(
    values([values([1, 2, 3])]),
    flatten(),
    through(function() {
      reads++
      console.log('READ', reads)
    }),
    take(2),
    collect(function(err, numbers) {
      t.deepEqual([1, 2], numbers)
      t.equal(reads, 2)
      t.end()
    })
  )
})
test('flatten stream of streams', function(t) {
  pull(
    values([
      values([1, 2, 3]),
      values([4, 5, 6]),
      values([7, 8, 9])
    ]),
    flatten(),
    collect(function(err, numbers) {
      t.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9], numbers)
      t.end()
    })
  )
})

test('flatten stream of broken streams', function(t) {
  var _err = new Error('I am broken'),
    sosEnded
  pull(
    values([error(_err)], function(err) {
      sosEnded = err
    }),
    flatten(),
    onEnd(function(err) {
      t.equal(err, _err)
      process.nextTick(function() {
        t.equal(sosEnded, null, 'should abort stream of streams')
        t.end()
      })
    })
  )
})

test('abort flatten', function(t) {
  var sosEnded, s1Ended, s2Ended
  var read = pull(
    values(
      [
        values([1, 2], function(err) {
          s1Ended = err
        }),
        values([3, 4], function(err) {
          s2Ended = err
        })
      ],
      function(err) {
        sosEnded = err
      }
    ),
    flatten()
  )

  read(null, function(err, data) {
    t.notOk(err)
    t.equal(data, 1)
    read(true, function(err, data) {
      t.equal(err, true)
      process.nextTick(function() {
        t.equal(sosEnded, null, 'should abort stream of streams')
        t.equal(s1Ended, null, 'should abort current nested stream')
        t.equal(s2Ended, undefined, 'should not abort queued nested stream')
        t.end()
      })
    })
  })
})

test('abort flatten before 1st read', function(t) {
  var sosEnded, s1Ended
  var read = pull(
    values(
      [
        values([1, 2], function(err) {
          s1Ended = err
        })
      ],
      function(err) {
        sosEnded = err
      }
    ),
    flatten()
  )

  read(true, function(err, data) {
    t.equal(err, true)
    t.notOk(data)
    process.nextTick(function() {
      t.equal(sosEnded, null, 'should abort stream of streams')
      t.equal(s1Ended, undefined, 'should abort current nested stream')
      t.end()
    })
  })
})

test('flattern handles stream with normal objects', function(t) {
  pull(
    values([[1, 2, 3], 4, [5, 6, 7], 8, 9, 10]),
    flatten(),
    collect(function(err, ary) {
      t.deepEqual(ary, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      t.end()
    })
  )
})
