/* tslint:disable no-any
 * no-unsafe-any
 * no-object-literal-type-assertion */

import {
  ValveError,
  ValveSink,
  ValveSource,
  ValveThrough,
  ValveType
} from './types'

import { forEach } from 'lodash'

export function valve<P, E = ValveError>(A1: ValveSink<P, E>): ValveSink<P, E>

// Source -> ...Through -> Sink

export function valve<P, E = ValveError>(
  A1: ValveSource<P, E>
): ValveSource<P, E>

export function valve<P1, E = ValveError>(
  A1: ValveSource<P1, E>,
  RR: ValveSink<P1, E>
): void

export function valve<P1, P2, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  RR: ValveSink<P2, E>
): void

export function valve<P1, P2, P3, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  RR: ValveSink<P3, E>
): void

export function valve<P1, P2, P3, P4, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  RR: ValveSink<P4, E>
): void

export function valve<P1, P2, P3, P4, P5, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>,
  RR: ValveSink<P5, E>
): void

export function valve<P1, P2, P3, P4, P5, P6, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>,
  A6: ValveThrough<P5, P6, E>,
  RR: ValveSink<P6, E>
): void

export function valve<P1, P2, P3, P4, P5, P6, P7, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>,
  A6: ValveThrough<P5, P6, E>,
  A7: ValveThrough<P6, P7, E>,
  RR: ValveSink<P7, E>
): void

export function valve<P1, P2, P3, P4, P5, P6, P7, P8, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>,
  A6: ValveThrough<P5, P6, E>,
  A7: ValveThrough<P6, P7, E>,
  A8: ValveThrough<P6, P8, E>,
  RR: ValveSink<P8, E>
): void

// ...Through -> Sink

export function valve<P1, P2, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveSink<P2, E>
): ValveSink<P2, E>

export function valve<P1, P2, P3, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveSink<P3, E>
): ValveSink<P3, E>

export function valve<P1, P2, P3, P4, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveSink<P4, E>
): ValveSink<P4, E>

export function valve<P1, P2, P3, P4, P5, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>,
  A5: ValveSink<P5, E>
): ValveSink<P5, E>

export function valve<P1, P2, P3, P4, P5, P6, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>,
  A5: ValveThrough<P5, P6, E>,
  A6: ValveSink<P6, E>
): ValveSink<P6, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>,
  A5: ValveThrough<P5, P6, E>,
  A6: ValveThrough<P6, P7, E>,
  A7: ValveSink<P7, E>
): ValveSink<P7, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, P8, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>,
  A5: ValveThrough<P5, P6, E>,
  A6: ValveThrough<P6, P7, E>,
  A7: ValveThrough<P7, P8, E>,
  A8: ValveSink<P8, E>
): ValveSink<P8, E>

// Source -> ...Through (TODO: finish this)

export function valve<P1, P2, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>
): ValveSource<P2, E>

export function valve<P1, P2, P3, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>
): ValveSource<P3, E>

export function valve<P1, P2, P3, P4, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>
): ValveSource<P4, E>

export function valve<P1, P2, P3, P4, P5, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>
): ValveSource<P5, E>

export function valve<P1, P2, P3, P4, P5, P6, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>,
  A6: ValveThrough<P5, P6, E>
): ValveSource<P6, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>,
  A6: ValveThrough<P5, P6, E>,
  A7: ValveThrough<P6, P7, E>
): ValveSource<P7, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, P8, E = ValveError>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>,
  A6: ValveThrough<P5, P6, E>,
  A7: ValveThrough<P6, P7, E>,
  A8: ValveThrough<P7, P8, E>
): ValveSource<P8, E>

// ...Through

export function valve<P1, P2, E = ValveError>(
  A1: ValveThrough<P1, P2, E>
): ValveThrough<P1, P2, E>

export function valve<P1, P2, P3, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>
): ValveThrough<P1, P3, E>

export function valve<P1, P2, P3, P4, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>
): ValveThrough<P1, P4, E>

export function valve<P1, P2, P3, P4, P5, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>
): ValveThrough<P1, P5, E>

export function valve<P1, P2, P3, P4, P5, P6, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>,
  A5: ValveThrough<P5, P6, E>
): ValveThrough<P1, P6, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>,
  A5: ValveThrough<P5, P6, E>,
  A6: ValveThrough<P6, P7, E>
): ValveThrough<P1, P7, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, P8, E = ValveError>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>,
  A5: ValveThrough<P5, P6, E>,
  A6: ValveThrough<P6, P7, E>,
  A7: ValveThrough<P7, P8, E>
): ValveThrough<P1, P8, E>

export function valve<E = ValveError>(
  ...props: Array<ValveThrough<any, any, E>>
): ValveThrough<any, any, E>

export function valve<E = ValveError>(
  A1: ValveSource<any, E>,
  ...props: Array<ValveThrough<any, any, E>>
): ValveSource<any, E>

export function valve<E = ValveError>(
  A1: ValveSource<any, E>,
  A2: ValveSink<any, E>
): void

export function valve<E = ValveError>(
  ...props: Array<
    ValveSink<any, E> | ValveSource<any, E> | ValveThrough<any, any, E>
  >
): void | ValveSource<any, E> | ValveSink<any, E> | ValveThrough<any, any, E> {
  const first = props[0]

  if (first.type === ValveType.Sink || first.type === ValveType.Through) {
    let trigger: boolean = false

    return {
      type: first.type,
      sink(source: ValveSource<any, E>) {
        if (trigger === true) {
          throw new TypeError('partial sink should only be called once!')
        }

        trigger = true

        props.unshift(source)

        return valve.apply(null, props)
      }
    } as ValveSink<any, E> | ValveThrough<any, any, E>
  }

  let read: void | ValveSource<any, E> = first

  forEach(props, stream => {
    if (
      (stream.type === ValveType.Sink || stream.type === ValveType.Through) &&
      // tslint:disable-next-line strict-boolean-expressions
      read
    ) {
      read = stream.sink(read)
    }
  })

  return read
}
