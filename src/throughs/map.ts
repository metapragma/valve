/* tslint:disable no-unsafe-any */

import { ValveThrough, ValveType } from '../types'

import { isDataAvailable } from '../util/isDataAvailable'

export function map<P, R, E = Error>(
  mapper: ((data: P) => R)
): ValveThrough<P, R, E> {
  return {
    type: ValveType.Through,
    sink(source) {
      return {
        type: ValveType.Source,
        source(abort, cb) {
          source.source(abort, (end, data) => {
            let newData: R | undefined

            try {
              newData = isDataAvailable(end, data) ? mapper(data) : undefined
            } catch (err) {
              return source.source(err, () => {
                return cb(err)
              })
            }

            cb(end, newData)
          })
        }
      }
    }
  }
}
