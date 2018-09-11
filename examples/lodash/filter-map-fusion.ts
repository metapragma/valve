
/* tslint:disable no-console */

import {
  filter,
  map,
  random,
  range,
  reduce
} from 'lodash'

const array = range(random(100, 150))

console.log(
  reduce(map(map(filter(map(array, x => x + 1), i => i % 2 !== 0), x => x + 1), y => y + 1), (f, g) => f + g)
)

console.log('completed')