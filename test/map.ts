import { drain, map, pull, values } from '../index'

import tape = require('tape')

tape('map throughs ends stream', t => {
  const err = new Error('unwholesome number')

  const p = pull(
    values([1, 2, 3, 3.4, 4]),
    map(e => {
      // tslint:disable-next-line no-bitwise
      if (e !== ~~e) throw err

      // return e
    }),
    drain(null,
    _err => {
      t.equal(_err, err)
      t.end()
    })
  )
})
