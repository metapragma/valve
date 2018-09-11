/* tslint:disable no-console no-submodule-imports */

import {
  random,
  range
} from 'lodash'

import xs from 'xstream'

const array = range(random(100, 150))

const stream = xs.fromArray(array)
  .map(i => i + 1)
  .filter(x => x % 2 !== 0)
  .map(i => i + 1)
  .map(i => i + 1)
  .filter(x => x % 2 === 0)
  .fold((x, y) => x + y, 0)
  .last()

stream.addListener({
  next: i => console.log(i),
  complete: () => console.log('completed'),
})
