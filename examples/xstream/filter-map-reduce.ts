/* tslint:disable no-console no-submodule-imports */

import { range } from 'lodash'
import xs from 'xstream'

const array = range(parseInt(process.argv.slice(2)[0], 10))

const stream = xs.fromArray(array)
.filter(x => x % 2 === 0)
.map(i => i + 1)
.fold((x, y) => x + y, 0)
.last()

stream.addListener({
  next: i => console.log(i),
  complete: () => console.log('completed'),
})
