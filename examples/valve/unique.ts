/* tslint:disable no-console */

import {
  collect,
  fromIterable,
  unique,
  valve,
} from '../../src/index'
import { concat, range } from 'lodash'

const a: number[] = concat(range(15), (range(15)))

console.log(a[0])

for (let i = 200; i < 211; i += 1) {
  a.splice(Math.floor((a.length - 1)), 0, i)
}
const compose = valve()

const stream = compose(
  fromIterable(a),
  unique(),
  collect()
)

// const stream = reduce<number, number>((x, y) => x + y, 0).pipe()(fromArray(array).pipe())

stream.subscribe({
  next: i => console.log(i),
  complete: () => console.log('completed')
})

stream.schedule()
