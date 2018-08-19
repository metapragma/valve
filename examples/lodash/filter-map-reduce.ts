/* tslint:disable no-console */

import { range, filter, map, reduce } from 'lodash'

const array = range(parseInt(process.argv.slice(2)[0], 10))

console.log(reduce(map(filter(array, x => x % 2 === 0), i => i + 1), (x, y) => x + y, 0))

console.log('completed')
