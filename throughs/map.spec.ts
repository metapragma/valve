import { collect, drain, map, pull, values } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

describe('throughs/map', () => {
  it('...', done => {
    const p = pull(
      values([1, 2, 3, 4, 5, 6]),
      map(n => {
        return n + 1
      }),
      collect((_, ary) => {
        expect(_).to.equal(null)
        expect(ary).to.deep.equal([2, 3, 4, 5, 6, 7])
        done()
      })
    )
  })

  it('error', done => {
    const err = new Error('unwholesome number')

    const p = pull(
      values([1, 2, 3, 3.4, 4]),
      map(e => {
        // tslint:disable-next-line no-bitwise
        if (e !== ~~e) throw err

        // return e
      }),
      drain(null,
        _err => {
          expect(_err).to.equal(err)
          done()
        })
    )
  })
})
