/* tslint:disable no-console */

import {
  random,
  range
} from 'lodash'

const array = range(random(90, 110))

console.log(array.reduce((x, y) => x + y, 0))

console.log('completed')
