import {
  collect,
  count,
  infinite,
  pull,
  take,
  through
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'
import { spy } from 'sinon'

// tslint:disable-next-line
import immediate = require('immediate')

describe('throughs/through', () => {
  it('...', done => {
    const s = spy()

    pull(
      count(5),
      through(() => {
        s()
      }),
      collect((err, ary) => {
        expect(s.callCount).to.equal(5)
        expect(err).to.equal(null)
        expect(ary).to.deep.equal([1, 2, 3, 4, 5])
        done()
      })
    )
  })

  it('onEnd', done => {
    pull(
      infinite(),
      through(null, err => {
        expect(err).to.equal(null)

        immediate(() =>{
          done()
        })
      }),
      take(10),
      collect((err, _) => {
        expect(err).to.equal(null)
      })
    )
  })
})
