/* tslint:disable no-console */

import {
  empty,
  // fromArray,
  collect,
  valve
} from '../../src/index'

// import array from '../smallArray'

const compose = valve()

const stream = compose(
  empty(),
  collect()
)

stream.subscribe({
  // next: i => console.log(i),
  complete: () => console.log('completed')
})

stream.schedule()
