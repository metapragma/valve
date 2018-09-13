/* tslint:disable no-console */

import array from '../smallArray'

console.log(
  array.map(x => x + 1).filter(x => x % 2 !== 0).map(i => i + 1)
    .map(y => y + 1).filter(x => x % 2 === 0).reduce((x, y) => x + y, 0)
)

console.log('completed')
