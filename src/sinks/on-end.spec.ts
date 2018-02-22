import { error, onEnd, pull, values } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

describe('sinks/on-end', () => {
  it('...', done => {
    pull(
      values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      onEnd(err => {
        expect(err).to.equal(false)
        done()
      })
    )
  })

  it('error', done => {
    const e = new Error('test')

    pull(
      error(e),
      onEnd(err => {
        expect(err).to.equal(e)
        done()
      })
    )
  })
})
