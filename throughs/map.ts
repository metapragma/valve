import {
  ValveThrough,
  ValveType
} from '../types'

export function map <P, R, E = Error>(mapper: ((data: P) => R)): ValveThrough<P, R, E> {

  return {
    type: ValveType.Through,
    sink(source) {
      return {
        type: ValveType.Source,
        source(abort, cb) {
          source.source(abort, (end, data) => {
            let newData: R

            try {
              newData = !end ? mapper(data) : null
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
