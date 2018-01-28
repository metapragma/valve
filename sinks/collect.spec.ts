import { collect, empty, pull } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

describe('sinks/collect', () => {
  it('...', done => {
    pull(
      empty(),
      collect((err, ary) => {
        expect(err).to.equal(false)
        expect(ary).to.deep.equal([])
        done()
      })
    )
  })
})
