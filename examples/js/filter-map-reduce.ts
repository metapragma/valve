/* tslint:disable no-console */

import { range } from 'lodash'

const array = range(parseInt(process.argv.slice(2)[0], 10))

console.log(array.filter(x => x % 2 === 0).map(i => i + 1).reduce((x, y) => x + y, 0))
console.log('completed')
