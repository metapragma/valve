import {
  IStreamThrough,
  StreamType
} from '../types'

export function map <P, R, E = Error>(mapper: ((data: P) => R)): IStreamThrough<P, R, E> {

  return {
    type: StreamType.Through,
    sink(source) {
      return {
        type: StreamType.Source,
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
