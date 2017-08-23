import {
  StreamThrough
} from '../types'

export function map <P, R, E = Error>(mapper: ((data: P) => R)): StreamThrough<P, R, E> {
  return read => {
    return (abort, cb) => {
      read(abort, (end, data) => {
        let newData: R

        try {
          newData = !end ? mapper(data) : null
        } catch (err) {
          return read(err, () => {
            return cb(err)
          })
        }

        cb(end, newData)
      })
    }
  }
}
