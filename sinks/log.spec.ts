import { log, pull, values } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'

describe('sinks/log', () => {
  it('...', done => {
    pull(
      values([1, 2, 3]),
      log(() => {
        done()
      })
    )
  })
})
