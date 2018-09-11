/* tslint:disable no-console */

import { random, range } from 'lodash'
import { from } from 'most'

const array = range(random(90, 110))

from(array)
  .map(i => i + 1)
  .filter(x => x % 2 !== 0)
  .map(y => y + 1)
  .map(z => z + 1)
  .filter(h => h % 2 === 0)
  .reduce((x, y) => x + y, 0)
  .then(result => {
    console.log(result)
    console.log('completed')
  })
