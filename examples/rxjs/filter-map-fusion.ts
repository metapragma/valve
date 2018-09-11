/* tslint:disable no-console no-submodule-imports */

import {
  random,
  range
} from 'lodash'

import { from } from 'rxjs'
import { filter, map, reduce } from 'rxjs/operators'

const array = range(random(100, 150))

from(array)
  .pipe(
    map(x => x + 1),
    filter(x => x % 2 !== 0),
    map(x => x + 1),
    map(x => x + 1),
    filter(x => x % 2 === 0),
    reduce((x, y) => x + y, 0)
  )
  .subscribe({
    next: i => console.log(i),
    complete: () => console.log('completed')
  })
