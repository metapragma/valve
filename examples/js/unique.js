/* tslint:disable no-console */
import { concat, range } from 'lodash'

const a = concat(range(15), (range(15)))

console.log(a[0])

for (let i = 200; i < 211; i += 1) {
  a.splice(Math.floor((a.length - 1)), 0, i)
}

const unique = array => array.filter((item, pos) => {
  return array.indexOf(item) === pos;
})

console.log(unique(a))

console.log('completed')
