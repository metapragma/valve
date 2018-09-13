/* tslint:disable no-console no-submodule-imports */

import {
  random,
  range
} from 'lodash'

import { from } from 'rxjs'
import { distinct } from 'rxjs/operators'

const array = range(random(100, 150))

from(array)
  .pipe(
    distinct()
  )
  .subscribe({
    next: i => console.log(i),
    complete: () => console.log('completed')
  })
