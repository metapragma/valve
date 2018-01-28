import { collect, map, pull, values } from '../index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { expect } from 'chai'

import {
  hasEnded
} from '../util/hasEnded'

import {
  isDataAvailable
} from '../util/isDataAvailable'

describe('utilities', () => {
  it('hasEnded', () => {
    expect(hasEnded(true)).to.equal(true)
    expect(hasEnded(false)).to.equal(false)
    expect(hasEnded(new Error())).to.equal(true)
  })

  it('isDataAvailable', () => {
    expect(isDataAvailable(true, undefined)).to.be.equal(false)
    expect(isDataAvailable(new Error(), undefined)).to.be.equal(false)
    expect(isDataAvailable(false, 'Data')).to.be.equal(true)
    expect(isDataAvailable(false, undefined)).to.be.equal(true)
    expect(isDataAvailable(true, 'Data')).to.be.equal(false)
    expect(isDataAvailable(new Error(), 'Data')).to.be.equal(false)
  })
})
