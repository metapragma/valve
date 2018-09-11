/* tslint:disable no-console */

import {
  random,
  range
} from 'lodash'

const array = range(random(90, 110))

console.log(
  array.map(x => x + 1).filter(x => x % 2 !== 0).map(i => i + 1)
    .map(y => y + 1).filter(x => x % 2 === 0).reduce((x, y) => x + y, 0)
)

console.log('completed')
