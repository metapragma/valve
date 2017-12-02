import {
  collect,
  map,
  pull,
  values
} from '../index'

import {
  ValveThrough
} from '../types'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai';

describe('test/compose', () => {
  it('test through streams compose on pipe', done => {

    const pipeline = pull(
      map((d: string) => {
        // make exciting!
        return `${d}!`
      }),
      map((d: string) => {
        // make loud
        return d.toUpperCase()
      }),
      map((d: string) => {
        // add sparkles
        return `*** ${d} ***`
      })
    )

    // the pipe line does not have a source stream.
    // so it should be a reader (function that accepts
    // a read function)

    // t.equal('function', typeof pipeline)
    // t.equal(1, pipeline.length)

    // if we pipe a read function to the pipeline,
    // the pipeline will become readable!

    const read = pull(
      values(['billy', 'joe', 'zeke']),
      pipeline
    )

    // t.equal('function', typeof read)
    // we will know it's a read function,
    // because read takes two args.
    // t.equal(2, read.length)

    pull(
      read,
      collect((_, array) => {
        expect(array).to.deep.equal(
          [ '*** BILLY! ***', '*** JOE! ***', '*** ZEKE! ***' ]
        )

        done()
      })
    )
  })
})
