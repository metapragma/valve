/* tslint:disable no-console */

import {
  filter,
  fromArray,
  map,
  reduce,
  valve
} from '../../src/index'
import { range } from 'lodash'

const array = range(parseInt(process.argv.slice(2)[0], 10))
const compose = valve()

const stream = compose(
  fromArray(array),
  filter(x => x % 2 === 0),
  map(i => i + 1),
  reduce((x, y) => x + y, 0)
)

// const stream = reduce<number, number>((x, y) => x + y, 0).pipe()(fromArray(array).pipe())

stream.subscribe({
  next: i => console.log(i),
  complete: () => console.log('completed')
})

stream.schedule()
