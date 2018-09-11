/* tslint:disable no-console no-submodule-imports */

import {
  random,
  range
} from 'lodash'

import { from } from 'rxjs'
import { reduce } from 'rxjs/operators'

const array = range(random(100, 150))

from(array)
  .pipe(
    reduce((x, y) => x + y, 0)
  )
  .subscribe({
    next: i => console.log(i),
    complete: () => console.log('completed')
  })
