import { fromIterable, map, pull, reduce, through } from './index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('pull', () => {
  it('wrap pull streams into stream', done => {
    pull(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      map(e => e * e),
      through(),
      reduce({
        iteratee(acc, data) {
          return acc + data
        },
        onData(action) {
          assert.equal(action.payload, 385)
          done()
        }
      })
    )
  })

  it('turn pull(through,...) -> Through', done => {
    pull(
      fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      pull(
        map<number, number>(e => {
          return e * e
        }),
        through<number>()
      ),
      reduce({
        iteratee(acc, data) {
          return acc + data
        },
        onData(action) {
          assert.equal(action.payload, 385)
          done()
        }
      })
    )
  })

  it('writable pull() should throw when called twice', () => {
    const stream = pull<number, number>(
      map((e: number) => {
        return e * e
      }),
      reduce({
        iteratee(acc, data) {
          return acc + data
        },
        onData(action) {
          assert.equal(action.payload, 385)
        }
      })
    )

    stream.sink(fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))

    assert.throws(() => {
      stream.sink(fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
    }, TypeError)
  })
})
