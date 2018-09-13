
/* tslint:disable no-console */

import {
  random,
  range,
  uniq
} from 'lodash'

const array = range(random(100, 150))

console.log(uniq(array))

console.log('completed')