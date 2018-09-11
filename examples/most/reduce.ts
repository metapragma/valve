/* tslint:disable no-console */

import { random, range } from 'lodash'
import { from } from 'most'

const array = range(random(90, 110))

from(array)
  .reduce((x, y) => x + y, 0)
  .then(result => {
    console.log(result)
    console.log('completed')
  })
