import {
  collect,
  drain,
  once,
  pull
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai';
import { spy } from 'sinon'

describe('sources/once', () => {
  it('...', done => {
    pull(
      once({ a: 1, b: 2, c: 3 }),
      collect((err, ary) => {
        expect(err).to.equal(null)
        expect(ary).to.deep.equal([{ a: 1, b: 2, c: 3 }])
        done()
      })
    )
  })

  it('abort', done => {
    const e = new Error('test')

    const s = spy()

    const d = drain(
      data => {
        expect(data).to.deep.equal({ a: 1, b: 2, c: 3 })
        s()

        d.sink.abort(e)
      },
      abort => {
        expect(abort).to.equal(e)
        expect(s.calledOnce).to.equal(true)
        done()
      }
    )

    pull(
      once({ a: 1, b: 2, c: 3 }, abort => {
        expect(abort).to.equal(e)
      }),
      d
    )
  })

  it('called once', done => {
    const s = spy()

    const d = drain(
      data => {
        expect(data).to.deep.equal({ a: 1, b: 2, c: 3 })
        s()
      },
      () => {
        expect(s.calledOnce).to.equal(true)
        done()
      }
    )

    pull(
      once({ a: 1, b: 2, c: 3 }, () => {
        done()
      }),
      d
    )
  })
})
