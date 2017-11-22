/* tslint:disable no-any */

import {
  IStreamSink,
  IStreamSource,
  IStreamThrough,
  StreamType
} from './types'

export function pull <P, E = Error>(
  A1: IStreamSink<P, E>,
): IStreamSink<P, E>

// Source -> ...Through -> Sink

export function pull <P, E = Error>(
  A1: IStreamSource<P, E>
): IStreamSource<P, E>

export function pull <P1, E = Error>(
  A1: IStreamSource<P1, E>,
  RR: IStreamSink<P1, E>,
): void

export function pull <P1, P2, E = Error>(
  A1: IStreamSource<P1, E>,
  A2: IStreamThrough<P1, P2, E>,
  RR: IStreamSink<P2, E>,
): void

export function pull <P1, P2, P3, E = Error>(
  A1: IStreamSource<P1, E>,
  A2: IStreamThrough<P1, P2, E>,
  A3: IStreamThrough<P2, P3, E>,
  RR: IStreamSink<P3, E>,
): void

export function pull <P1, P2, P3, P4, E = Error>(
  A1: IStreamSource<P1, E>,
  A2: IStreamThrough<P1, P2, E>,
  A3: IStreamThrough<P2, P3, E>,
  A4: IStreamThrough<P3, P4, E>,
  RR: IStreamSink<P4, E>,
): void

export function pull <P1, P2, P3, P4, P5, E = Error>(
  A1: IStreamSource<P1, E>,
  A2: IStreamThrough<P1, P2, E>,
  A3: IStreamThrough<P2, P3, E>,
  A4: IStreamThrough<P3, P4, E>,
  A5: IStreamThrough<P4, P5, E>,
  RR: IStreamSink<P5, E>,
): void

export function pull <P1, P2, P3, P4, P5, P6, E = Error>(
  A1: IStreamSource<P1, E>,
  A2: IStreamThrough<P1, P2, E>,
  A3: IStreamThrough<P2, P3, E>,
  A4: IStreamThrough<P3, P4, E>,
  A5: IStreamThrough<P4, P5, E>,
  A6: IStreamThrough<P5, P6, E>,
  RR: IStreamSink<P6, E>,
): void

export function pull <P1, P2, P3, P4, P5, P6, P7, E = Error>(
  A1: IStreamSource<P1, E>,
  A2: IStreamThrough<P1, P2, E>,
  A3: IStreamThrough<P2, P3, E>,
  A4: IStreamThrough<P3, P4, E>,
  A5: IStreamThrough<P4, P5, E>,
  A6: IStreamThrough<P5, P6, E>,
  A7: IStreamThrough<P6, P7, E>,
  RR: IStreamSink<P7, E>,
): void

export function pull <P1, P2, P3, P4, P5, P6, P7, P8, E = Error>(
  A1: IStreamSource<P1, E>,
  A2: IStreamThrough<P1, P2, E>,
  A3: IStreamThrough<P2, P3, E>,
  A4: IStreamThrough<P3, P4, E>,
  A5: IStreamThrough<P4, P5, E>,
  A6: IStreamThrough<P5, P6, E>,
  A7: IStreamThrough<P6, P7, E>,
  A8: IStreamThrough<P6, P8, E>,
  RR: IStreamSink<P8, E>,
): void

// ...Through -> Sink (TODO: finish this)

export function pull <P1, P2, E = Error>(
  A1: IStreamThrough<P1, P2, E>,
  A2: IStreamSink<P2, E>
): IStreamSink<P2, E>

export function pull <P1, P2, P3, E = Error>(
  A1: IStreamThrough<P1, P2, E>,
  A2: IStreamThrough<P2, P3, E>,
  A3: IStreamSink<P3, E>
): IStreamSink<P3, E>

export function pull <P1, P2, P3, P4, E = Error>(
  A1: IStreamThrough<P1, P2, E>,
  A2: IStreamThrough<P2, P3, E>,
  A3: IStreamThrough<P3, P4, E>,
  A4: IStreamSink<P4, E>
): IStreamSink<P4, E>

// Source -> ...Through (TODO: finish this)

export function pull <P1, P2, E = Error>(
  A1: IStreamSource<P1, E>,
  A2: IStreamThrough<P1, P2, E>
): IStreamSource<P2, E>

export function pull <P1, P2, P3, E = Error>(
  A1: IStreamSource<P1, E>,
  A2: IStreamThrough<P1, P2, E>,
  A3: IStreamThrough<P2, P3, E>
): IStreamSource<P3, E>

export function pull <P1, P2, P3, P4, E = Error>(
  A1: IStreamSource<P1, E>,
  A2: IStreamThrough<P1, P2, E>,
  A3: IStreamThrough<P2, P3, E>,
  A4: IStreamThrough<P3, P4, E>
): IStreamSource<P4, E>

// ...Through

export function pull <P1, P2, E = Error>(
  A1: IStreamThrough<P1, P2, E>
): IStreamThrough<P1, P2, E>

export function pull <P1, P2, P3, E = Error>(
  A1: IStreamThrough<P1, P2, E>,
  A2: IStreamThrough<P2, P3, E>
): IStreamThrough<P1, P3, E>

export function pull <P1, P2, P3, P4, E = Error>(
  A1: IStreamThrough<P1, P2, E>,
  A2: IStreamThrough<P2, P3, E>,
  A3: IStreamThrough<P3, P4, E>
): IStreamThrough<P1, P4, E>

export function pull <P1, P2, P3, P4, P5, E = Error>(
  A1: IStreamThrough<P1, P2, E>,
  A2: IStreamThrough<P2, P3, E>,
  A3: IStreamThrough<P3, P4, E>,
  A4: IStreamThrough<P4, P5, E>
): IStreamThrough<P1, P5, E>

export function pull <P1, P2, P3, P4, P5, P6, E = Error>(
  A1: IStreamThrough<P1, P2, E>,
  A2: IStreamThrough<P2, P3, E>,
  A3: IStreamThrough<P3, P4, E>,
  A4: IStreamThrough<P4, P5, E>,
  A5: IStreamThrough<P5, P6, E>
): IStreamThrough<P1, P6, E>

export function pull <P1, P2, P3, P4, P5, P6, P7, E = Error>(
  A1: IStreamThrough<P1, P2, E>,
  A2: IStreamThrough<P2, P3, E>,
  A3: IStreamThrough<P3, P4, E>,
  A4: IStreamThrough<P4, P5, E>,
  A5: IStreamThrough<P5, P6, E>,
  A6: IStreamThrough<P6, P7, E>
): IStreamThrough<P1, P7, E>

export function pull <P1, P2, P3, P4, P5, P6, P7, P8, E = Error>(
  A1: IStreamThrough<P1, P2, E>,
  A2: IStreamThrough<P2, P3, E>,
  A3: IStreamThrough<P3, P4, E>,
  A4: IStreamThrough<P4, P5, E>,
  A5: IStreamThrough<P5, P6, E>,
  A6: IStreamThrough<P6, P7, E>,
  A7: IStreamThrough<P7, P8, E>
): IStreamThrough<P1, P8, E>

export function pull <E = Error>(
  ...props: Array<
    IStreamThrough<any, any, E>
  >
): IStreamThrough<any, any, E>

export function pull <E = Error>(
  A1: IStreamSource<any, E>, 
  ...props: Array<
    IStreamThrough<any, any, E>
  >
): IStreamSource<any, E>

export function pull <E = Error>(
  A1: IStreamSource<any, E>,
  A2: IStreamSink<any, E>
): void 

export function pull <E = Error>(
  ...props: Array<
    IStreamSink<any, E> |
    IStreamSource<any, E> |
    IStreamThrough<any, any, E>
  >
): void |
  IStreamSource<any, E> |
  IStreamSink<any, E> |
  IStreamThrough<any, any, E>
{
  const length = props.length
  const a: IStreamSource<any, E> | IStreamSink<any, E> | IStreamThrough<any, any, E> = props[0]

  if (a.type === StreamType.Sink) {
    // tslint:disable-next-line no-shadowed-variable
    return {
      type: StreamType.Sink,
      sink (source: IStreamSource<any, E>) {
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

  if (a.type === StreamType.Through) {
    // tslint:disable-next-line no-shadowed-variable
    return {
      type: StreamType.Through,
      sink (source: IStreamSource<any, E>) {
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

  let read: void | IStreamSource<any, E> = a

  // tslint:disable-next-line no-increment-decrement
  for (let i = 1; i < length; i++) {
    const s = props[i]
    if ((s.type === StreamType.Sink || s.type === StreamType.Through) && read) {
      read = s.sink(read)
    }
  }

  return read
}
