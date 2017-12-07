/* tslint:disable variable-name */

import {
  collect,
  drain,
  pull,
  pushable,
  take,
  through
} from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai';
import { spy } from 'sinon'

describe('sources/pushable', () => {
  it('...', done => {
    const { push, end, source } = pushable()

    pull(
      source,
      collect((err, ary) => {
        expect(err).to.equal(null)
        expect(ary).to.deep.equal([1, 2, 3, 4, 5])
        done()
      })
    )

    push(1)
    push(2)
    push(3)
    push(4)
    push(5)
    end()
    push(6)
  })

  it('call count', done => {
    const { push, end, source } = pushable()
    const s = spy()
    const ERR = new Error('testing')

    pull(
      source,
      through(s),
      collect((err, ary) => {
        expect(s.callCount).to.equal(5)
        expect(err).to.equal(ERR)
        expect(ary).to.deep.equal([1, 2, 3, 4, 5])
        done()
      })
    )

    push(1)
    push(2)
    push(3)
    push(4)
    push(5)
    end(ERR)
    end(ERR)
    push(6)
  })

  it('close callback', done => {
    let i = 0

    const { push, end, source } = pushable(err => {
      if (err) {
        throw err
      }

      expect(i).to.equal(3)
      done()
    })

    pull(
      source,
      take(3),
      drain(d => {
        // tslint:disable-next-line no-increment-decrement
        expect(d).to.equal(++i)
      })
    )

    push(1)
    push(2)
    push(3)
    push(4)
    push(5)
  })

  it('abort after a read', done => {
    const _err = new Error('test error')

    const { push, end, source } = pushable(err => {
      expect(err).to.equal(_err)
    })

    source.source(null, (err, _) => {
      expect(err).to.equal(_err)
    })

    source.source(_err, (err, _) => {
      expect(err).to.equal(_err)
      done()
    })
  })

  it('abort without a read', done => {
    const _err = new Error('test error')

    const { push, end, source } = pushable(err => {
      expect(err).to.equal(_err)
    })

    source.source(_err, (err, _) => {
      expect(err).to.equal(_err)
      done()
    })
  })

  it('abort without a read, with data', done => {
    const _err = new Error('test error')

    const { push, end, source } = pushable(err => {
      expect(err).to.equal(_err)
    })

    source.source(_err, (err, _) => {
      expect(err).to.equal(_err)
      done()
    })

    push(1)
  })

  it('end', done => {
    const { push, end, source } = pushable()

    push(1)
    push(2)
    push(3)
    end()

    source.source(null, (_end, _data) => {
      expect(_data).to.equal(1)
      expect(_end).to.equal(null)
      source.source(null, (__end, __data) => {
        expect(__data).to.equal(2)
        expect(__end).to.equal(null)
        source.source(null, (___end, ___data) => {
          expect(___data).to.equal(3)
          expect(___end).to.equal(null)
          source.source(null, (____end, ____data) => {
            expect(____data).to.equal(undefined)
            expect(____end).to.equal(true)
            done()
          })
        })
      })
    })
  })
})
