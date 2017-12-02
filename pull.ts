/* tslint:disable no-any */

import {
  ValveSink,
  ValveSource,
  ValveThrough,
  ValveType
} from './types'

export function pull <P, E = Error>(
  A1: ValveSink<P, E>,
): ValveSink<P, E>

// Source -> ...Through -> Sink

export function pull <P, E = Error>(
  A1: ValveSource<P, E>
): ValveSource<P, E>

export function pull <P1, E = Error>(
  A1: ValveSource<P1, E>,
  RR: ValveSink<P1, E>,
): void

export function pull <P1, P2, E = Error>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  RR: ValveSink<P2, E>,
): void

export function pull <P1, P2, P3, E = Error>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  RR: ValveSink<P3, E>,
): void

export function pull <P1, P2, P3, P4, E = Error>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  RR: ValveSink<P4, E>,
): void

export function pull <P1, P2, P3, P4, P5, E = Error>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>,
  RR: ValveSink<P5, E>,
): void

export function pull <P1, P2, P3, P4, P5, P6, E = Error>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>,
  A6: ValveThrough<P5, P6, E>,
  RR: ValveSink<P6, E>,
): void

export function pull <P1, P2, P3, P4, P5, P6, P7, E = Error>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>,
  A6: ValveThrough<P5, P6, E>,
  A7: ValveThrough<P6, P7, E>,
  RR: ValveSink<P7, E>,
): void

export function pull <P1, P2, P3, P4, P5, P6, P7, P8, E = Error>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>,
  A5: ValveThrough<P4, P5, E>,
  A6: ValveThrough<P5, P6, E>,
  A7: ValveThrough<P6, P7, E>,
  A8: ValveThrough<P6, P8, E>,
  RR: ValveSink<P8, E>,
): void

// ...Through -> Sink (TODO: finish this)

export function pull <P1, P2, E = Error>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveSink<P2, E>
): ValveSink<P2, E>

export function pull <P1, P2, P3, E = Error>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveSink<P3, E>
): ValveSink<P3, E>

export function pull <P1, P2, P3, P4, E = Error>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveSink<P4, E>
): ValveSink<P4, E>

// Source -> ...Through (TODO: finish this)

export function pull <P1, P2, E = Error>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>
): ValveSource<P2, E>

export function pull <P1, P2, P3, E = Error>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>
): ValveSource<P3, E>

export function pull <P1, P2, P3, P4, E = Error>(
  A1: ValveSource<P1, E>,
  A2: ValveThrough<P1, P2, E>,
  A3: ValveThrough<P2, P3, E>,
  A4: ValveThrough<P3, P4, E>
): ValveSource<P4, E>

// ...Through

export function pull <P1, P2, E = Error>(
  A1: ValveThrough<P1, P2, E>
): ValveThrough<P1, P2, E>

export function pull <P1, P2, P3, E = Error>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>
): ValveThrough<P1, P3, E>

export function pull <P1, P2, P3, P4, E = Error>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>
): ValveThrough<P1, P4, E>

export function pull <P1, P2, P3, P4, P5, E = Error>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>
): ValveThrough<P1, P5, E>

export function pull <P1, P2, P3, P4, P5, P6, E = Error>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>,
  A5: ValveThrough<P5, P6, E>
): ValveThrough<P1, P6, E>

export function pull <P1, P2, P3, P4, P5, P6, P7, E = Error>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>,
  A5: ValveThrough<P5, P6, E>,
  A6: ValveThrough<P6, P7, E>
): ValveThrough<P1, P7, E>

export function pull <P1, P2, P3, P4, P5, P6, P7, P8, E = Error>(
  A1: ValveThrough<P1, P2, E>,
  A2: ValveThrough<P2, P3, E>,
  A3: ValveThrough<P3, P4, E>,
  A4: ValveThrough<P4, P5, E>,
  A5: ValveThrough<P5, P6, E>,
  A6: ValveThrough<P6, P7, E>,
  A7: ValveThrough<P7, P8, E>
): ValveThrough<P1, P8, E>

export function pull <E = Error>(
  ...props: Array<
    ValveThrough<any, any, E>
  >
): ValveThrough<any, any, E>

export function pull <E = Error>(
  A1: ValveSource<any, E>, 
  ...props: Array<
    ValveThrough<any, any, E>
  >
): ValveSource<any, E>

export function pull <E = Error>(
  A1: ValveSource<any, E>,
  A2: ValveSink<any, E>
): void 

export function pull <E = Error>(
  ...props: Array<
    ValveSink<any, E> |
    ValveSource<any, E> |
    ValveThrough<any, any, E>
  >
): void |
  ValveSource<any, E> |
  ValveSink<any, E> |
  ValveThrough<any, any, E>
{
  const length = props.length
  const a: ValveSource<any, E> | ValveSink<any, E> | ValveThrough<any, any, E> = props[0]

  if (a.type === ValveType.Sink) {
    // tslint:disable-next-line no-shadowed-variable
    return {
      type: ValveType.Sink,
      sink (source: ValveSource<any, E>) {
        if (props == null) {
          throw new TypeError('partial sink should only be called once!')
        }

        // Grab the reference after the check, because it's always an array now
        // (engines like that kind of consistency).
        const ref = props
        props = null

        ref.unshift(source)

        return pull.apply(null, ref)
      }
    }
  }

  if (a.type === ValveType.Through) {
    // tslint:disable-next-line no-shadowed-variable
    return {
      type: ValveType.Through,
      sink (source: ValveSource<any, E>) {
        if (props == null) {
          throw new TypeError('partial sink should only be called once!')
        }

        // Grab the reference after the check, because it's always an array now
        // (engines like that kind of consistency).
        const ref = props
        props = null

        ref.unshift(source)

        return pull.apply(null, ref)
      }
    }
  }
    
    // (read: StreamSource<any, E>) => {
    //   // Prioritize common case of small number of pulls.
    //   // switch (length) {
    //   //   case 1:
    //   //     return pull(read, ref[0])
    //   //   case 2:
    //   //     return pull(read, ref[0], ref[1])
    //   //   case 3:
    //   //     return pull(read, ref[0], ref[1], ref[2])
    //   //   case 4:
    //   //     return pull(read, ref[0], ref[1], ref[2], ref[3])
    //   //   default:
    //   //     ref.unshift(read)
    //   //
    //   //     return pull.apply(null, ref)
    //   // }
    //   ref.unshift(read)

    //   return pull.apply(null, ref)
    // }

  let read: void | ValveSource<any, E> = a

  // tslint:disable-next-line no-increment-decrement
  for (let i = 1; i < length; i++) {
    const s = props[i]
    if ((s.type === ValveType.Sink || s.type === ValveType.Through) && read) {
      read = s.sink(read)
    }
  }

  return read
}
