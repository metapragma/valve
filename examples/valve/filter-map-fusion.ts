/* tslint:disable no-console */

import {
  filter,
  fromArray,
  map,
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
  map(x => x + 1),
  filter(x => x % 2 !== 0),
  map(i => i + 1),
  map(x => x + 1),
  filter(x => x % 2 === 0),
  reduce((x, y) => x + y, 0)
)

stream.subscribe({
  next: i => console.log(i),
  complete: () => console.log('completed')
})

stream.schedule()
