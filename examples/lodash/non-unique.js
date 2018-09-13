
/* tslint:disable no-console */

import {
  countBy,
  random,
  range,
  transform
} from 'lodash'

const array = range(random(100, 150))

console.log(
  transform(countBy(array), (result, count, value) => {
    if (count > 1) result.push(value);
  }, [])
)

console.log('completed')