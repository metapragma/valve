import { ValveError } from '../types'
import { Sink } from '../internal/Sink'

export const reduce = <P, R = P, E extends ValveError = ValveError>(
  iteratee: (accumulator: R, next: P) => R,
  accumulator?: R
): Sink<P, R, E> =>
  Sink.create(({ next, complete, error }) => {
    // tslint:disable-next-line no-any
    let acc: any = accumulator
    let initAccum: boolean = acc === undefined

    return {
      next(value) {
        // tslint:disable-next-line ban-comma-operator no-unsafe-any
        acc = initAccum ? ((initAccum = false), value) : iteratee(acc, value)
      },
      complete() {
        if (!initAccum) {
          // tslint:disable-next-line no-unsafe-any
          next(acc)
          complete()
        } else {
          complete()
        }
      },
      error(value) {
        error(value)
      }
    }
  })
