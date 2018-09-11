
/* tslint:disable no-console */

import {
  random,
  range,
  reduce
} from 'lodash'

const array = range(random(100, 150))

console.log(
  reduce(array, (x, y) => x + y, 0)
)

console.log('completed')