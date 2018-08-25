/* tslint:disable no-console no-submodule-imports */

import { range } from 'lodash'
import { from } from 'rxjs'
import { filter, map, reduce } from 'rxjs/operators'

const array = range(parseInt(process.argv.slice(2)[0], 10))

from(array)
  .pipe(
    filter(x => x % 2 === 0),
    map(x => x + 1),
    reduce((x, y) => x + y, 0)
  )
  .subscribe({
    next: i => console.log(i),
    complete: () => console.log('completed')
  })
