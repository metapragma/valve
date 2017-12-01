import { abortCb } from '../util/abort-cb'

import {
  asyncMap,
  drain as pullDrain,
  empty,
  error,
  infinite,
  pull,
  values
} from '../index'

import {
  IStreamSource,
  StreamAbort,
  StreamType
} from '../types'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai';
import { spy } from 'sinon'

function delay () {
  return asyncMap((e, cb) => {
    setTimeout(() => {
      cb(null, e)
    }, 1)
  })
}

function inf <E = Error>(
  onAbort?: (abort: StreamAbort<E>) => void
): IStreamSource<number, E> {
  // tslint:disable-next-line insecure-random
  const f = Math.random

  return {
    type: StreamType.Source,
    source(abort, cb) {
      if (abort) return abortCb(cb, abort, onAbort)

      cb(null, f())
    }
  }
}

describe('sinks/drain', () => {
  it('abort on drain (return)', done => {
    let c = 100
    const s = spy()
    const drain = pullDrain(
      () => {
        s()
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) return false
      },
      abort => {
        expect(abort).to.equal(true)
        expect(s.callCount).to.equal(100)
        done()
      }
    )

    pull(infinite(), drain)
  })

  it('abort on drain (sink.abort)', done => {
    let c = 100
    const e = new Error('test')
    const s = spy()

    const drain = pullDrain(
      () => {
        s()
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) drain.sink.abort(e)
      },
      err => {
        expect(err).to.equal(e)
        expect(s.callCount).to.equal(100)
        done()
      }
    )

    pull(infinite(), drain)
  })

  it('delayed abort on drain (return)', done => {
    let c = 100
    const s = spy()

    const drain = pullDrain(
      () => {
        s()
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) return false
      },
      abort => {
        expect(abort).to.equal(true)
        expect(s.callCount).to.equal(100)
        done()
      }
    )

    pull(infinite(), delay(), drain)
  })

  it('delayed abort on drain (sink.abort)', done => {
    let c = 100
    const s = spy()
    const e = new Error('test')
    const drain = pullDrain(
      () => {
        s()
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) drain.sink.abort(e)
      },
      err => {
        expect(err).to.equal(e)
        expect(s.callCount).to.equal(100)
        done()
      }
    )

    pull(infinite(), delay(), drain)
  })

  it('delayed abort on drain (delayed sink.abort)', done => {
    let c = 0
    const ERR = new Error('test ABORT')

    const drain = pullDrain(
      () => {
        // tslint:disable-next-line no-increment-decrement
        --c
      },
      err => {
        expect(c < 0).to.equal(true)
        expect(err).to.equal(ERR)
        done()
      }
    )

    pull(infinite(), delay(), drain)

    setTimeout(() => {
      drain.sink.abort(ERR)
    }, 100)
  })

  it('source onAbort called multiple times', done => {
    let c = 100
    const e = new Error('test')
    const s1 = spy()
    const s2 = spy()

    const drain = pullDrain(
      () => {
        s1()
        if (c < 0) throw new Error('stream should have aborted')
        // tslint:disable-next-line no-increment-decrement
        if (!--c) drain.sink.abort(e)
      },
      err => {
        s2()
        expect(err).to.equal(e)
      }
    )

    pull(
      inf(
        () => {
          expect(s1.callCount).to.equal(100)
          expect(s2.callCount).to.equal(1)
          done()
        }
      ),
      drain
    )
  })

  it('sink.abort callback', done => {
    let c = 0
    const ERR = new Error('test ABORT')

    const s = spy()

    const drain = pullDrain(
      () => {
        // tslint:disable-next-line no-increment-decrement
        --c
      },
      err => {
        s()
        expect(c < 0).to.equal(true)
        expect(err).to.equal(ERR)
      }
    )

    pull(infinite(), delay(), drain)

    setTimeout(() => {
      drain.sink.abort(ERR, (err, _) => {
        expect(s.callCount).to.equal(1)
        expect(err).to.equal(ERR)
        done()
      })
    }, 100)
  })

  it('error', () => {
    const ERR = new Error('qwe')

    expect(() =>
      pull(
        error(ERR),
        pullDrain(
          data => {
            expect(data).to.equal(undefined)
          },
        )
      )
    ).to.throw(ERR)
  })

  it('empty', () => {
    const ERR = new Error('qwe')

    pull(
      empty(),
      pullDrain(
        data => {
          expect(data).to.equal(undefined)
        },
      )
    )
  })

  it('initial abort', done => {
    const ERR = new Error('qwe')
    const s = spy()

    const stream = pullDrain(
      data => {
        s()
        expect(data).to.equal(undefined)
      },
      err => {
        expect(err).to.equal(ERR)
        expect(s.callCount).to.equal(0)
        done()
      }
    )

    stream.sink.abort(ERR)

    pull(
      values([1, 2, 3, 4]),
      stream
    )
  })
})
