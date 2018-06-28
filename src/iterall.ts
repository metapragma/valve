/**
 * Iterall (https://github.com/leebyron/iterall)
 *
 * Minimal zero-dependency utilities for using Iterables in all JavaScript environments.
 *
 * Copyright (c) 2016, Lee Byron
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-ITERALL file in the root directory of this source tree.
 */

/* istanbul ignore file */
/* tslint:disable no-any no-unsafe-any strict-boolean-expressions completed-docs strict-type-predicates */

import { isArrayLike } from 'lodash'

// In ES2015 environments, Symbol exists
const SYMBOL /*: any */ = typeof Symbol === 'function' ? Symbol : void 0

// In ES2015 (or a polyfilled) environment, this will be Symbol.iterator
const SYMBOL_ITERATOR = SYMBOL && SYMBOL.iterator

const $$iterator: symbol | string = SYMBOL_ITERATOR || '@@iterator'

export function getIterator<TValue>(iterable: Iterable<TValue>): Iterator<TValue>
export function getIterator(iterable: any): void | Iterator<any> {
  const method = getIteratorMethod(iterable)

  if (method) {
    return method.call(iterable)
  }
}

export function getIteratorMethod<TValue>(iterable: Iterable<TValue>): () => Iterator<TValue>
export function getIteratorMethod(iterable: any): void | (() => Iterator<any>) {
  if (iterable != null) {
    const method = (SYMBOL_ITERATOR && iterable[SYMBOL_ITERATOR]) || iterable['@@iterator']
    if (typeof method === 'function') {
      return method
    }
  }
}

class ArrayLikeIterator {
  public _o: any
  public _i: number

  constructor(obj: any) {
    this._o = obj
    this._i = 0
  }

  public next() {
    if (this._o === void 0 || this._i >= this._o.length) {
      this._o = void 0

      return { value: void 0, done: true }
    }

    // tslint:disable-next-line no-increment-decrement
    return { value: this._o[this._i++], done: false }
  }

  // tslint:disable-next-line function-name
  public [$$iterator]() {
    return this
  }
}

export function createIterator<TValue>(
  collection: Iterable<TValue> | ArrayLike<TValue>
): Iterator<TValue>
// export function createIterator(collection: { length: number }): Iterator<any>
export function createIterator(collection: any): void | Iterator<any> {
  const iterator = getIterator(collection)

  if (iterator) {
    return iterator
  }

  if (isArrayLike(collection)) {
    return new ArrayLikeIterator(collection)
  }
}
