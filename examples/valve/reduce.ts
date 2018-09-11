/* tslint:disable no-console */

import {
  fromArray,
  reduce,
  valve
} from '../../src/index'

import {
  random,
  range
} from 'lodash'

const array = range(random(100, 150))

const compose = valve()

const stream = compose(
  fromArray(array),
  reduce((x, y) => x + y, 0)
)

stream.subscribe({
  next: i => console.log(i),
  complete: () => console.log('completed')
})

stream.schedule()
