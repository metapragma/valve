import { ValveError, ValveSinkFactory } from '../types'
import { createSink } from '../internal/createSink'

export const reduce = <P, R = P, E extends ValveError = ValveError>(
  iteratee: (accumulator: R, next: P) => R,
  accumulator?: R
): ValveSinkFactory<P, R, {}, E> =>
  createSink<P, R, {}, E>(({ next, complete, error }) => {
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
